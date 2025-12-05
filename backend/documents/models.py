import uuid
import os
from django.db import models
from django.conf import settings
from django.core.validators import FileExtensionValidator


def document_upload_path(instance, filename):
    """Generate upload path for documents"""
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    return os.path.join('documents', filename)


class Tag(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    color = models.CharField(max_length=7, default='#1D4ED8')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'tags'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Document(models.Model):
    VISIBILITY_CHOICES = [
        ('PRIVATE', 'Private'),
        ('ROLE_BASED', 'Role Based'),
        ('PUBLIC', 'Public'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=500)
    description = models.TextField(blank=True)
    file = models.FileField(
        upload_to=document_upload_path,
        validators=[FileExtensionValidator(allowed_extensions=['pdf'])]
    )
    file_size = models.IntegerField(default=0)
    page_count = models.IntegerField(default=0)
    snippet = models.TextField(blank=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='documents'
    )
    visibility = models.CharField(
        max_length=20,
        choices=VISIBILITY_CHOICES,
        default='PRIVATE'
    )
    tags = models.ManyToManyField(Tag, related_name='documents', blank=True)
    analyzed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'documents'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if self.file:
            self.file_size = self.file.size
        super().save(*args, **kwargs)


class DocumentAnalysis(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document = models.OneToOneField(
        Document,
        on_delete=models.CASCADE,
        related_name='analysis'
    )
    summary = models.TextField()
    key_points = models.JSONField(default=list)
    model_used = models.CharField(max_length=100)
    analyzed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'document_analyses'
    
    def __str__(self):
        return f"Analysis for {self.document.title}"
