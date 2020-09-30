from graphene import relay, ObjectType
from graphene_django import DjangoObjectType

from .models import User, Group, Message

class UserNode(DjangoObjectType):
    class Meta: 
        model = User
        fields = "__all__"
        interfaces = (relay.Node,)

class GroupNode(DjangoObjectType):
    class Meta:
        model = Group
        fields = "__all__"
        interfaces = (relay.Node,)

class MessageNode(DjangoObjectType):
    class Meta: 
        model = Message
        fields = "__all__"
        interfaces = (relay.Node,)

class UserConnection(relay.Connection):
    class Meta:
        node = UserNode

class MainQuery(ObjectType):
    users = relay.ConnectionField(UserConnection)

    def resolve_users(root, info, **kwargs):
        return User.objects.all()

