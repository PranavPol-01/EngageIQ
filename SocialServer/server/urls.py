
from django.contrib import admin
from django.urls import path
from . import views
from . import run_playwright_install  # import the newly created view
from . import astra_db_handler

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/post/', views.handle_post, name='handle_post'),
        path('api/postvector/', views.handle_post_vector, name='handle_post'),

    path('api/testpost/', views.test_post, name='test_post'),
    path('fetch_data/', views.check_last_success, name='check_last_success'),
    path('delete_user/', astra_db_handler.delete_user, name='delete_user'),
    path('clear_databases/', astra_db_handler.clear_databases, name='clear_databases'),

    # path('astra-collections/', views.get_collections, name='astra_collections'),
    # path('add_account/', views.add_account, name='add_account'),
    # path('add_reel/', views.add_reel, name='add_reel'),
    # path('add_post/', views.add_post, name='add_post'),
    # path('add_carousel/', views.add_carousel, name='add_carousel'),
    path('run-migrations/', views.run_migrations, name='run_migrations'),
    path('execute-playwright-install/', run_playwright_install.install_playwright, name='execute_playwright_install'),

]
