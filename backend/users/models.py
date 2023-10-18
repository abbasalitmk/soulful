from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.db.models import JSONField


class MyUserManager(BaseUserManager):
    def create_user(self, email, name, password=None, **extra_fields):
        """
        Creates and saves a User with the given phone, dpassword.
        """

        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Creates and saves a superuser with the given email and password.
        """
        extra_fields.setdefault("is_admin", True)
        extra_fields.setdefault("is_staff", True)

        if extra_fields.get("is_admin") is not True:
            raise ValueError("Superuser must have is_admin=True.")

        return self.create_user(email, password=password, **extra_fields)


class MyUser(AbstractBaseUser):
    email = models.EmailField(verbose_name="email address", unique=True)
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    profile_completed = models.BooleanField(default=False)

    objects = MyUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    # Add the required methods from PermissionsMixin

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return self.is_admin

    def __str__(self):
        return self.email


class UserProfile(models.Model):
    user = models.ForeignKey(
        MyUser, on_delete=models.CASCADE, related_name="user_profile"
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=50, null=True, blank=True)
    dob = models.DateField()
    gender = models.CharField(max_length=50)
    place = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    skinColor = models.CharField(max_length=255, null=True, blank=True)
    hairColor = models.CharField(max_length=255, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    status = models.CharField(null=True, blank=True)

    def __str__(self):
        return self.user.name


class UserPreferences(models.Model):
    user = models.ForeignKey(
        MyUser, on_delete=models.CASCADE, related_name="user_preference"
    )
    gender = models.CharField(max_length=50)
    interests = JSONField()

    def __str__(self):
        return self.user.name


class Images(models.Model):
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="profile")


class Followers(models.Model):
    user = models.ForeignKey(
        MyUser, on_delete=models.CASCADE, related_name="followed_users"
    )
    followed_user = models.ForeignKey(
        MyUser, on_delete=models.CASCADE, related_name="user"
    )

    class Meta:
        unique_together = ("user", "followed_user")

    def __str__(self):
        return f"{self.user} follows {self.followed_user}"


class PasswordReset(models.Model):
    email = models.EmailField(unique=True)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)


class GoogleLogin(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
