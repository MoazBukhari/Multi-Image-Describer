from django.shortcuts import render
# Create your views here.




def home(request):
    context = {
        'heading': 'Hello from the Template!'
    }
    return render(request, 'index.html', context)

