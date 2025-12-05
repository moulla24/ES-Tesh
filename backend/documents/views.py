from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.utils.dateparse import parse_date
import threading
from .models import Document, Tag
from .serializers import (
    DocumentSerializer, DocumentCreateSerializer,
    DocumentUpdateSerializer, TagSerializer
)
from .ai_service import analyze_document_with_ollama


class DocumentListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return DocumentCreateSerializer
        return DocumentSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = Document.objects.all()
        
        # Filter based on visibility and user permissions
        if not user.is_admin:
            queryset = queryset.filter(
                Q(owner=user) |
                Q(visibility='PUBLIC') |
                (Q(visibility='ROLE_BASED') & Q(owner__role=user.role))
            )
        
        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(snippet__icontains=search)
            )
        
        # Filter by visibility
        visibility = self.request.query_params.get('visibility')
        if visibility:
            queryset = queryset.filter(visibility=visibility)
        
        # Filter by tags
        tags = self.request.query_params.get('tags')
        if tags:
            tag_list = [t.strip() for t in tags.split(',')]
            queryset = queryset.filter(tags__name__in=tag_list).distinct()
        
        # Filter by analyzed status
        analyzed = self.request.query_params.get('analyzed')
        if analyzed is not None:
            analyzed_bool = analyzed.lower() == 'true'
            queryset = queryset.filter(analyzed=analyzed_bool)
        
        # Filter by owner (admin only)
        owner_id = self.request.query_params.get('owner')
        if owner_id and user.is_admin:
            queryset = queryset.filter(owner__id=owner_id)
        
        # Filter by date range
        date_from = self.request.query_params.get('date_from')
        if date_from:
            date_obj = parse_date(date_from)
            if date_obj:
                queryset = queryset.filter(created_at__gte=date_obj)
        
        date_to = self.request.query_params.get('date_to')
        if date_to:
            date_obj = parse_date(date_to)
            if date_obj:
                queryset = queryset.filter(created_at__lte=date_obj)
        
        # Ordering
        ordering = self.request.query_params.get('ordering', '-created_at')
        queryset = queryset.order_by(ordering)
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        document = serializer.save(owner=request.user)
        
        # Start analysis in background thread
        thread = threading.Thread(
            target=analyze_document_with_ollama,
            args=(document,)
        )
        thread.daemon = True
        thread.start()
        
        # Return full document serializer
        return Response(
            DocumentSerializer(document, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )


class DocumentDetailView(generics.RetrieveUpdateAPIView):
    queryset = Document.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method in ['PATCH', 'PUT']:
            return DocumentUpdateSerializer
        return DocumentSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = Document.objects.all()
        
        # Apply visibility filters for retrieve
        if self.request.method == 'GET':
            if not user.is_admin:
                queryset = queryset.filter(
                    Q(owner=user) |
                    Q(visibility='PUBLIC') |
                    (Q(visibility='ROLE_BASED') & Q(owner__role=user.role))
                )
        # For update, only owner or admin can modify
        else:
            if not user.is_admin:
                queryset = queryset.filter(owner=user)
        
        return queryset
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        # Return full document serializer
        return Response(
            DocumentSerializer(instance, context={'request': request}).data
        )


class DocumentDeleteView(generics.DestroyAPIView):
    queryset = Document.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Document.objects.all()
        return Document.objects.filter(owner=user)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyze_document(request, pk):
    """Manually trigger document analysis"""
    try:
        document = Document.objects.get(pk=pk)
        
        # Check permissions
        if not request.user.is_admin and document.owner != request.user:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Start analysis in background
        thread = threading.Thread(
            target=analyze_document_with_ollama,
            args=(document,)
        )
        thread.daemon = True
        thread.start()
        
        return Response({
            'message': 'Analyse lancée',
            'document_id': str(document.id)
        })
    
    except Document.DoesNotExist:
        return Response(
            {'error': 'Document not found'},
            status=status.HTTP_404_NOT_FOUND
        )


class TagListView(generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def document_stats(request):
    """Get document statistics (admin only)"""
    if not request.user.is_admin:
        return Response(
            {'error': 'Admin access required'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    total_documents = Document.objects.count()
    analyzed_documents = Document.objects.filter(analyzed=True).count()
    analyzed_percentage = (analyzed_documents / total_documents * 100) if total_documents > 0 else 0
    
    return Response({
        'total_documents': total_documents,
        'analyzed_documents': analyzed_documents,
        'analyzed_percentage': round(analyzed_percentage, 2)
    })
