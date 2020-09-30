from graphene import relay, ObjectType, Mutation, String, Field, List, ID
from graphene_django import DjangoObjectType

from .models import User, Group, Message
import datetime

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

class CreateUserMutation(Mutation):
    class Arguments:
        username = String(required=True)
        publicKey = String(required=True)

    user = Field(UserNode)

    def mutate(self, info, username, publicKey):
        user = User.objects.create(username=username, publicKey=publicKey)
        return CreateUserMutation(user=user)

class CreateGroupMutation(Mutation):
    class Arguments:
        name = String(required=True)
        publicKey = String(required=True)
        users = List(String)

    group = Field(GroupNode)

    def mutate(self, info, name, publicKey, users):
        group = Group.objects.create(name=name, publicKey=publicKey)
        for username in users:
            u = User.objects.get(username=username)
            group.users.add(u)
        return CreateGroupMutation(group=group)

class CreateMessageMutation(Mutation):
    class Arguments:
        group = String(required=True)
        content = String(required=True)
        sender = String(required=True)

    message = Field(MessageNode)

    def mutate(self, info, group, content, sender):
        print(group, sender)
        group_object = Group.objects.get(gid=group)
        sender_object = User.objects.get(username=sender)
        message = Message.objects.create(group=group_object, content=content, sender=sender_object)
        return CreateMessageMutation(message=message)

class Mutation(ObjectType):
    create_user = CreateUserMutation.Field()
    create_group = CreateGroupMutation.Field()
    create_message = CreateMessageMutation.Field()
