from django.shortcuts import render, HttpResponse
from .forms import Calc
import json
import math
import haversine as hs

# Create your views here.
def index(request):
    if request.method == "POST":
      #Get the posted form
      MyForm = Calc(request.POST)
      pointA= request.POST.get('pointA')
      pointB = request.POST.get('pointB')
      loc1 = (float(pointA.split(',')[0]), float(pointA.split(',')[1]))
      loc2 = (float(pointB.split(',')[0]), float(pointB.split(',')[1]))
      
      dist = hs.haversine(loc1,loc2)
      response = {'distance' : round(dist, 2) }
      return HttpResponse(json.dumps(response),
            content_type="application/json"
        )
    else:
      MyForm = Calc()

    return render(request, 'home.html',{"form": MyForm})
