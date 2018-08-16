from django.shortcuts import render
from django.views.generic import View
from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from django.urls import reverse
from django.conf import settings

import json


class IndexView(View):

    def __init__(self):
        self.template_name = "home/index.html"

    def get(self, request):
        return render(request, self.template_name, {})


class LoginView(View):

    def __init__(self):
        self.template_name = "home/index.html"

    def post(self, request):
        if request.session.get("login"):
            return JsonResponse({"code": -1})

        query = json.loads(request.body.decode("utf-8"))
        token = query.get("token")

        request.session["login"] = True
        request.session["token"] = token
        return JsonResponse({"code": 0})


class LogoutView(View):

    def __init__(self):
        self.template_name = "home/index.html"

    def get(self, request):
        if not request.session.get("login"):
            return HttpResponseRedirect(reverse("home:index"))

        del request.session["login"]
        del request.session["token"]
        return HttpResponseRedirect(reverse("home:index"))

    def post(self, request):
        if not request.session.get("login"):
            return JsonResponse({"code": -1})

        del request.session["login"]
        del request.session["token"]
        return JsonResponse({"code": 0})


