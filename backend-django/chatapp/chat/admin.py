from django.contrib import admin
from chatapp.chat.models import User, Group, Message

admin.site.register(User)
admin.site.register(Group)
admin.site.register(Message)
