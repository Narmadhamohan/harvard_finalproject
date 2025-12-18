**Skill Training Project – Django REST + JavaScript Web Application**

**Project Overview**
web50/projects/2020/x/capstone
web50/projects/2020/x/capstone/README.md
https://cs50.harvard.edu/web/projects/final/capstone/


This project is a full-stack web application built using Django and Django REST Framework on the backend and JavaScript on the frontend. The application is designed around a real-world, workflow-driven use case involving user profiles, job postings, job applications and internal/external communication through mail services. The goal of the project was to build a production-style system that demonstrates backend architecture, API design, frontend integration and role-based behavior.



**Distinctiveness and Complexity**



This project is intentionally designed to be distinct from other projects, both in domain and architecture.



Users interact with the system through purpose-driven workflows, such as creating profiles, posting jobs, 
applying for jobs and managing applications. Each action is governed by business rules and permissions.



Note:

It is not a social network with posts, likes. It is not an e-commerce application with cart, product catalog or transactional based services. This makes the project fundamentally different from Project 2 or Pizza projects.



The complexity of the project goes beyond basic CRUD operations. While CRUD actions exist, they are embedded within multi-step, 
conditional workflows. 
Examples :

Preventing users from applying to their own jobs, blocking duplicate applications, restricting applicant views to job owners, dynamically determining profile completion status and supporting both internal mail delivery. The backend uses multiple related models, custom serializers, pagination strategies, filtering, and permissions. 

We are using JWT based authentucation with refresh token concept. 

The frontend dynamically reacts to API responses using JavaScript, enabling search and conditional rendering.

Features:

A. Login and Signup
1.User Registration (Signup)
Users can create a new account by providing required details such as username, email, and password.

B.User Login
1.Registered users can log in using valid credentials.
Authentication is handled securely using token-based/session-based authentication.
2.Invalid login attempts are handled with proper error messages.
3.First-Time Login Flow
For newly registered users, the dashboard prompts them to complete their profile.
Users are guided to fill mandatory profile details before accessing full features of the application.
4. User Dashboard
 Dashboard Overview should allow to edit and save the details


C. Profiles
1. Users can create and update their profile with personal, professional, and contact details.
Profile information can include skills, experience, location, and other relevant fields.
2.Profile Viewing
Users can view experts profile who registered in the site.
3. Search based on filter conditions like skill, experince, name in Profile list
4.Profile Validation


D. Jobs
1.Job Listing
Users can view available job postings on the platform.
Job details include job title, description, requirements, and company information.
2.Job Search and Filtering
Users can search jobs based on keywords.
Filters can be applied such as location, job type, or role (if enabled).
3. Job Application (If Applicable)
Eligible users can apply for jobs directly through the platform with the resume.

E. Post Job
1.Job Posting
Job posting form includes fields like job title, description, required skills, and location.
2.Job Management
Job posters can create or close their posted jobs.
3. View posted jobs by particular user. Filter posted jobs y using location.
4. View applicants in a job and provide option to download resume


F. Messaging
1. User Communication
Enables messaging between users by providing message option in the user profile.
2.Messages are stored securely and displayed in conversation format.




File Structure and Contents

DRF:

manage.py – Django project entry point
project/ – Main Django configuration
settings.py – Installed apps, middleware, authentication
urls.py – Root URL routing
users/ – User, profile and authentication logic
models.py – User and Profile models
serializers.py – Validation and data representation
views.py – User and Profile viewsets
jobs/ – Job posts and applications
models.py – JobPost and JobApplication models
views.py – Job-related APIs
mail/ – Internal message handling
pagination.py – Custom pagination classes
requirements.txt – Python dependencies
README.md – Project documentation

Frontend:
Frontend (React) – File Structure and Contents

package.json – Project dependencies and scripts

public/index.html – Main HTML entry point

src/ – Application source code

index.js – React entry point

App.js – Root component and layout

api/ – Backend API communication

axiosClient.js – Central Axios configuration

authApi.js – Login and signup APIs

profileApi.js – User profile APIs

jobsApi.js – Job listing and posting APIs

messageApi.js – Messaging APIs

components/ – Reusable UI components

auth/ – Login, Signup, Protected routes

profile/ – Profile create, update, view

jobs/ – Job list, job details, post job

messages/ – Chat and messaging UI

common/ – Navbar, Footer, Loader

pages/ – Page-level components

Home.js – Landing page

Dashboard.js – User dashboard

NotFound.js – 404 page

context/ – Global state management,AuthContext.js – Authentication state,
ProfileContext.js – Profile completion state

routes/ – Application routing,AppRoutes.js – Route definitions

styles/ – CSS files,main.css – Global styles



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
POST /api/profiles/{id}/send_mail/ – Send mail to profile owner

Job Posts
GET /api/jobposts/ – List job posts
POST /api/jobposts/ – Create job post
POST /api/jobposts/{id}/apply/ – Apply for a job
POST /api/jobposts/{id}/close/ – Close job
GET /api/jobposts/my-posts/ – View own job posts

Job Applications
GET /api/jobposts/{job/{id}/applicants/ – View applicants (job owner only)
GET /api/my-applied-jobs/ – View jobs applied by logged-in user
Mail
GET /api/mail/?box=inbox – Inbox
GET /api/mail/?box=sent – Sent mails
POST /api/mail/ – Send mail

How to Run the Application?
Clone the repository
Create and activate a virtual environment
Install dependencies:
pip install -r requirements.txt

Apply migrations:
python manage.py migrate

Run the server:
python manage.py runserver
Open http://127.0.0.1:8000/

