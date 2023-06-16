from django import forms

class Calc(forms.Form):
   pointA = forms.CharField(max_length = 100)
   pointB = forms.CharField(max_length = 100)