# NSS Backend - Admin Login Credentials

## Default Admin Account

When you start the backend for the first time, it will automatically create an admin account with these credentials:

```
Email: admin@niter.edu
Password: admin123
```

## How to Login

1. **Start MongoDB** (must be running first):
   ```powershell
   # If MongoDB is installed as a service:
   net start MongoDB
   
   # Or run mongod directly:
   mongod
   ```

2. **Start the Backend Server**:
   ```powershell
   cd d:\NSS\Backend
   npm start
   ```
   
   You should see:
   ```
   Mongo connected
   Seeded admin user: admin@niter.edu
   Server running on port 5000
   ```

3. **Start the Frontend**:
   ```powershell
   cd d:\NSS\Frontend
   npm run dev
   ```

4. **Access Admin Panel**:
   - Open browser to `http://localhost:8080/admin` (or whatever port Vite shows)
   - Login with:
     - Email: `admin@niter.edu`
     - Password: `admin123`

## Changing Admin Credentials

To change the admin email or password:

1. Edit `Backend/.env` file
2. Update `ADMIN_EMAIL` and `ADMIN_PASSWORD`
3. Delete the old admin from MongoDB (or drop the users collection)
4. Restart the backend server
5. New admin will be created automatically

## Security Notes

⚠️ **IMPORTANT**: 
- Change the default password before deploying to production!
- Update `SESSION_SECRET` in `.env` to a random string
- Never commit `.env` file to git (it's in `.gitignore`)

## Admin Panel Features

Once logged in, you can:
- ✅ Create/Edit/Delete Events
- ✅ Create/Edit/Delete Blog Posts
- ✅ Create/Edit/Delete Projects
- ✅ Create/Edit/Delete Alumni Profiles
- ✅ Upload Gallery Images
- ✅ View Contact Form Messages

## Troubleshooting

**Can't login?**
- Check MongoDB is running
- Check backend console for "Seeded admin user" message
- Verify credentials in `Backend/.env` file
- Clear browser cookies and try again

**"Invalid credentials" error?**
- Make sure you're using the exact credentials from `.env`
- Check for typos in email/password
- Try restarting the backend server

**Session expires quickly?**
- Sessions last 24 hours by default
- Check `SESSION_SECRET` is set in `.env`
- Make sure `withCredentials: true` is in frontend API config
