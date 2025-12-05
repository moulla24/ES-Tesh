from django.urls import path
from .views import (
    DocumentListCreateView, DocumentDetailView,
    analyze_document, TagListView, document_stats
)

urlpatterns = [
    path('', DocumentListCreateView.as_view(), name='document_list_create'),
    path('tags/', TagListView.as_view(), name='tag_list'),
    path('stats/', document_stats, name='document_stats'),
    path('<uuid:pk>/', DocumentDetailView.as_view(), name='document_detail'),
    path('<uuid:pk>/analyze/', analyze_document, name='document_analyze'),
]
