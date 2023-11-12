# base/forms.py

from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.password_validation import get_default_password_validators
from django import forms
from django.contrib.auth import get_user_model

class RegistrationForm(UserCreationForm):
    password1 = forms.CharField(
        label="Password",
        strip=False,
        widget=forms.PasswordInput(attrs={'autocomplete': 'new-password'}),
        help_text=get_default_password_validators(),
    )
    password2 = forms.CharField(
        label="Password confirmation",
        widget=forms.PasswordInput(attrs={'autocomplete': 'new-password'}),
        strip=False,
        help_text="Enter the same password as before, for verification.",
    )

    class Meta(UserCreationForm.Meta):
        model = get_user_model()
        fields = UserCreationForm.Meta.fields



# from django.contrib.auth.forms import UserCreationForm
# from django.contrib.auth.password_validation import get_default_password_validators
# from django import forms
# from django.contrib.auth import get_user_model

# class CustomRegistrationForm(UserCreationForm):
#     password1 = forms.CharField(
#         label="Password",
#         strip=False,
#         widget=forms.PasswordInput(attrs={'autocomplete': 'new-password'}),
#         help_text=get_default_password_validators(),
#     )
#     password2 = forms.CharField(
#         label="Password confirmation",
#         widget=forms.PasswordInput(attrs={'autocomplete': 'new-password'}),
#         strip=False,
#         help_text="Enter the same password as before, for verification.",
#     )

#     class Meta(UserCreationForm.Meta):
#         model = get_user_model()
#         fields = UserCreationForm.Meta.fields
