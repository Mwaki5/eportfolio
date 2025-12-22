# Migration Notes

## Evidence Model Update

The Evidence model has been updated to include an `evidenceType` field that stores whether the evidence is an "image" or "video".

### Database Migration Required

You need to add the `evidenceType` column to your Evidence table. Run this SQL:

```sql
ALTER TABLE Evidence 
ADD COLUMN evidenceType ENUM('image', 'video') NOT NULL DEFAULT 'image' 
AFTER description;
```

Or create a migration file in `backend/migrations/`:

```javascript
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Evidence', 'evidenceType', {
      type: Sequelize.ENUM('image', 'video'),
      allowNull: false,
      defaultValue: 'image',
      after: 'description'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Evidence', 'evidenceType');
  }
};
```

## Port Configuration

The backend runs on port 5000. Make sure your frontend axios configuration matches:
- `frontend/src/api/axios.js` uses `http://localhost:5000`

## New Features

1. **Admin Dashboard** - Accessible at `/admin/dashboard`
2. **Staff Dashboard** - Accessible at `/staff/dashboard`  
3. **Student Dashboard** - Accessible at `/student/dashboard`

All dashboards show relevant metrics cards.

4. **File Upload with Progress** - Evidence upload now shows progress bar
5. **Image/Video Support** - Evidence can now be images or videos, displayed accordingly
6. **Organized Evidence Display** - Evidence is organized by unit, then by type (images/videos)

