**Skill Training Project – Django REST + JavaScript Web Application**

**Project Overview**



This project is a full-stack web application built using Django and Django REST Framework on the backend and JavaScript on the frontend. The application is designed around a real-world, workflow-driven use case involving user profiles, job postings, job applications and internal/external communication through mail services. The goal of the project was to build a production-style system that demonstrates backend architecture, API design, frontend integration and role-based behavior.



**Distinctiveness and Complexity**



This project is intentionally designed to be distinct from other projects in this course, both in domain and structure.



Users interact with the system through purpose-driven workflows, such as creating profiles, posting jobs, applying for jobs and managing applications. Each action is governed by business rules and permissions.



Note:

It is not a social network with posts, likes. It is not an e-commerce application with cart, product catalog or transactional based services. This makes the project fundamentally different from Project 2 or Pizza projects.



The complexity of the project goes beyond basic CRUD operations. While CRUD actions exist, they are embedded within multi-step, conditional workflows. Examples :

Preventing users from applying to their own jobs, blocking duplicate applications, restricting applicant views to job owners, dynamically determining profile completion status and supporting both internal mail delivery. The backend uses multiple related models, custom serializers, pagination strategies, filtering, and permissions. 

We are using JWT based auth with refresh token concept. 

The frontend dynamically reacts to API responses using JavaScript, enabling search and conditional rendering.



File Structure and Contents



manage.py – Django project entry point



project/ – Main Django configuration



settings.py – Installed apps, middleware, authentication



urls.py – Root URL routing



users/ – User, profile, and authentication logic



models.py – User and Profile models



serializers.py – Validation and data representation



views.py – User and Profile viewsets



jobs/ – Job posts and applications



models.py – JobPost and JobApplication models



views.py – Job-related APIs



mail/ – Internal and external mail handling



pagination.py – Custom pagination classes



requirements.txt – Python dependencies



README.md – Project documentation



API Endpoints Documentation



All APIs are prefixed with /api/.



Users



POST /api/users/signup/ – Register a new user



POST /api/users/login/ – Authenticate user



GET /api/users/me/ – Get current user details



Profiles



GET /api/profiles/ – List profiles (search, filter, pagination)



POST /api/profiles/submit/ – Create or update own profile



GET /api/profiles/status/ – Check profile completion



POST /api/profiles/{id}/send\_mail/ – Send mail to profile owner



Job Posts



GET /api/jobposts/ – List job posts



POST /api/jobposts/ – Create job post



POST /api/jobposts/{id}/apply/ – Apply for a job



POST /api/jobposts/{id}/close/ – Close job



GET /api/jobposts/my-posts/ – View own job posts



Job Applications



GET /api/jobposts/{job\_id}/applicants/ – View applicants (job owner only)



GET /api/my-applied-jobs/ – View jobs applied by logged-in user



Mail



GET /api/mail/?box=inbox – Inbox



GET /api/mail/?box=sent – Sent mails



POST /api/mail/ – Send mail





How to Run the Application



Clone the repository



Create and activate a virtual environment



Install dependencies:



pip install -r requirements.txt





Apply migrations:



python manage.py migrate





Run the server:



python manage.py runserver





Open http://127.0.0.1:8000/

