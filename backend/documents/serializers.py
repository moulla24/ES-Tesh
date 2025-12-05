from rest_framework import serializers
from .models import Document, Tag, DocumentAnalysis
from authentication.serializers import UserSerializer


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'color', 'created_at']
        read_only_fields = ['id', 'created_at']


class DocumentAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentAnalysis
        fields = ['summary', 'key_points', 'model_used', 'analyzed_at']


class DocumentSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    analysis = DocumentAnalysisSerializer(read_only=True)
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = [
            'id', 'title', 'description', 'file', 'file_url',
            'file_size', 'page_count', 'owner', 'visibility',
            'analyzed', 'tags', 'snippet', 'analysis',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'file_size', 'page_count', 'analyzed',
            'created_at', 'updated_at'
        ]
    
    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None


class DocumentCreateSerializer(serializers.ModelSerializer):
    tags = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = Document
        fields = [
            'title', 'description', 'file', 'visibility', 'tags'
        ]
    
    def create(self, validated_data):
        tags_str = validated_data.pop('tags', '')
        document = Document.objects.create(**validated_data)
        
        # Process tags
        if tags_str:
            tag_names = [tag.strip() for tag in tags_str.split(',') if tag.strip()]
            for tag_name in tag_names:
                tag, created = Tag.objects.get_or_create(name=tag_name)
                document.tags.add(tag)
        
        return document


class DocumentUpdateSerializer(serializers.ModelSerializer):
    tags = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )
    
    class Meta:
        model = Document
        fields = ['title', 'description', 'visibility', 'tags']
    
    def update(self, instance, validated_data):
        tags_list = validated_data.pop('tags', None)
        
        # Update basic fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update tags if provided
        if tags_list is not None:
            instance.tags.clear()
            for tag_name in tags_list:
                tag_name = tag_name.strip()
                if tag_name:
                    tag, created = Tag.objects.get_or_create(name=tag_name)
                    instance.tags.add(tag)
        
        return instance
