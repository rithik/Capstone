from django.db import models

class User(models.Model):
    publicKey = models.CharField(max_length=1000)
    username = models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.username

class Group(models.Model):
    publicKey = models.CharField(max_length=1000)
    users = models.ManyToManyField(User, related_name="groups")
    name = models.CharField(max_length=1000)

    def __str__(self):
        return self.name

class Message(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="messages")
    content = models.CharField(max_length=10000)
    ts = models.DateTimeField(auto_now_add=True)
    m_type = models.CharField(max_length=100) # text | file | key
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages")
    
    def __str__(self):
        return self.content
