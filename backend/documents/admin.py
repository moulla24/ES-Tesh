from django.contrib import admin
from .models import Document, Tag, DocumentAnalysis


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name', 'color', 'created_at']
    search_fields = ['name']
    ordering = ['name']


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['title', 'owner', 'visibility', 'analyzed', 'file_size', 'created_at']
    list_filter = ['visibility', 'analyzed', 'created_at']
    search_fields = ['title', 'description', 'owner__email']
    filter_horizontal = ['tags']
    ordering = ['-created_at']
    readonly_fields = ['file_size', 'page_count', 'analyzed', 'created_at', 'updated_at']


@admin.register(DocumentAnalysis)
class DocumentAnalysisAdmin(admin.ModelAdmin):
    list_display = ['document', 'model_used', 'analyzed_at']
    search_fields = ['document__title']
    readonly_fields = ['analyzed_at']
