from django.urls import path
from .views import (
    DocumentListCreateView, DocumentDetailView,
    DocumentUpdateView, DocumentDeleteView,
    analyze_document, TagListView, document_stats
)

urlpatterns = [
    path('', DocumentListCreateView.as_view(), name='document_list_create'),
    path('<uuid:pk>/', DocumentDetailView.as_view(), name='document_detail'),
    path('<uuid:pk>/update/', DocumentUpdateView.as_view(), name='document_update'),
    path('<uuid:pk>/delete/', DocumentDeleteView.as_view(), name='document_delete'),
    path('<uuid:pk>/analyze/', analyze_document, name='document_analyze'),
    path('tags/', TagListView.as_view(), name='tag_list'),
    path('stats/', document_stats, name='document_stats'),
]
