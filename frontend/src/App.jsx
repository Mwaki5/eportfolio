import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./features/login/Login";
import Addstudent from "./features/user/Addstudent";
import StaffLayout from "./layouts/staff";
import StudentLayout from "./layouts/student";
import Editstudent from "./features/user/Editstudent";
import AddUnit from "./features/unit/AddUnit";
//import EditUnit from "./features/unit/EditUnit";
import EnrollUnit from "./features/unit/EnrollUnit";
import AddDepartment from "./features/department/AddDepartment";
import DeleteDepartment from "./features/department/DeleteDepartment";
import EditDepartment from "./features/department/EditDepartment";
import ViewDepartment from "./features/department/ViewDepartment";
import SearchDepartment from "./features/department/SearchDepartment";
import RegisterMarks from "./features/marks/RegisterMarks";
import EditMarks from "./features/marks/EditMarks";
import DeleteMarks from "./features/marks/DeleteMarkModal";
import ViewMarks from "./features/marks/FilterMarks";
import ViewMyMarks from "./features/marks/ViewMyMarks";
import AddEvidence from "./features/evidence/AddEvidence";
import ViewMyEvidence from "./features/evidence/ViewMyEvidence";
import ViewAllEvidence from "./features/evidence/ViewAllEvidence";
import DeleteEvidence from "./features/evidence/DeleteEvidence";
import UpdateEvidence from "./features/evidence/UpdateEvidence";
import ViewMyEnrollments from "./features/enrollment/ViewMyEnrollments";
import ViewAllEnrollments from "./features/enrollment/ViewAllEnrollments";
import DeleteEnrollment from "./features/enrollment/DeleteEnrollmentModal";
import UpdateEnrollment from "./features/enrollment/UpdateEnrollmentModal";
import EditUnit from "./features/unit/EditUnits";
import DeleteUnit from "./features/unit/DeleteUnitModal";
import ViewMyProfile from "./features/user/ViewMyProfile";
import EditMyProfile from "./features/user/EditMyProfile";
import AdminDashboard from "./features/dashboard/AdminDashboard";
import StaffDashboard from "./features/dashboard/StaffDashboard";
import StudentDashboard from "./features/dashboard/StudentDashboard";
import AdminLayout from "./layouts/admin";
import PersistLogin from "./components/PersistLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import FilterStudent from "./features/user/FilterStudents";
import FilterUnit from "./features/unit/FilterUnit";
import FilterEnrollment from "./features/enrollment/FilterEnrollment";
function App() {
  return (
    <React.Fragment>
      <Routes>
        {/* <Route path="/" element={<Login />} /> */}
        <Route path="/" element={<Login />} />

        <Route element={<PersistLogin />}>
          {/* Admin Routes - Protected by staff role (admin uses staff role) */}
          <Route element={<ProtectedRoute allowedRoles={["staff"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="index" element={<AdminDashboard />} />

              {/* Student Management - Admin Only */}
              <Route path="student/add" element={<Addstudent />} />
              <Route path="student/edit/details" element={<Editstudent />} />

              {/* Unit Management - Admin Only */}
              <Route path="unit/edit" element={<EditUnit />} />
              <Route path="unit/add" element={<AddUnit />} />
              <Route path="unit/delete" element={<DeleteUnit />} />

              {/* Department Management - Admin Only */}
              <Route path="department/register" element={<AddDepartment />} />
              <Route path="department/edit" element={<EditDepartment />} />
              <Route path="department/delete" element={<DeleteDepartment />} />
              <Route path="department/view" element={<ViewDepartment />} />
              <Route path="department/search" element={<SearchDepartment />} />

              {/* Enrollment Management - Admin Only */}
              <Route path="enrollment/view" element={<ViewAllEnrollments />} />
              <Route path="enrollment/add" element={<EnrollUnit />} />
              <Route path="enrollment/edit" element={<UpdateEnrollment />} />
              <Route path="enrollment/delete" element={<DeleteEnrollment />} />

              {/* Evidence Management - Admin Only */}
              <Route path="evidence/view" element={<ViewAllEvidence />} />
              <Route path="evidence/edit" element={<UpdateEvidence />} />
              <Route path="evidence/delete" element={<DeleteEvidence />} />

              {/* Marks Management - Admin Only */}
              <Route path="mark/view" element={<ViewMarks />} />
              <Route path="mark/add" element={<RegisterMarks />} />
              <Route path="mark/edit" element={<EditMarks />} />
              <Route path="mark/delete" element={<DeleteMarks />} />

              <Route path="*" element={<AdminDashboard />} />
            </Route>
          </Route>

          {/* Staff Routes - Protected by staff role */}
          <Route element={<ProtectedRoute allowedRoles={["staff"]} />}>
            <Route path="/staff" element={<StaffLayout />}>
              {/* <Route path="dashboard" element={<StaffDashboard />} /> */}
              <Route path="index" element={<StaffDashboard />} />
              {/* Student Management - Staff */}
              <Route path="student/add" element={<Addstudent />} />
              <Route path="student/edit/details" element={<Editstudent />} />
              <Route
                path="student/filter/details"
                element={<FilterStudent />}
              />
              {/* Unit Management - Staff */}
              <Route path="unit/edit" element={<EditUnit />} />
              <Route path="unit/add" element={<AddUnit />} />
              <Route path="unit/delete" element={<DeleteUnit />} />
              <Route path="unit/filter" element={<FilterUnit />} />
              {/* Enrollment Management - Staff */}
              <Route path="enrollment/view" element={<ViewAllEnrollments />} />
              <Route path="enrollment/add" element={<EnrollUnit />} />
              <Route path="enrollment/edit" element={<UpdateEnrollment />} />
              <Route path="enrollment/delete" element={<DeleteEnrollment />} />
              <Route path="enrollment/filter" element={<FilterEnrollment />} />
              {/* Evidence Management - Staff */}
              <Route path="evidence/view" element={<ViewAllEvidence />} />
              <Route path="evidence/edit" element={<UpdateEvidence />} />
              <Route path="evidence/delete" element={<DeleteEvidence />} />
              {/* Marks Management - Staff */}
              <Route path="mark/view" element={<ViewMarks />} />
              <Route path="mark/add" element={<RegisterMarks />} />
              <Route path="mark/edit" element={<EditMarks />} />
              <Route path="mark/delete" element={<DeleteMarks />} />
              {/* Department Management - Staff */}
              <Route path="department/view" element={<ViewDepartment />} />
              <Route path="department/search" element={<SearchDepartment />} />
              <Route path="*" element={<StaffDashboard />} />
            </Route>
          </Route>

          {/* Student Routes - Protected by student role */}
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/student" element={<StudentLayout />}>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="index" element={<StudentDashboard />} />

              {/* Student Profile Management */}
              <Route path="profile/view" element={<ViewMyProfile />} />
              <Route path="profile/edit" element={<EditMyProfile />} />

              {/* Evidence Management - Student */}
              <Route path="evidence/add" element={<AddEvidence />} />
              <Route path="evidence/view" element={<ViewMyEvidence />} />

              {/* Marks - Student */}
              <Route path="marks/view" element={<ViewMyMarks />} />

              {/* Enrollments - Student */}
              <Route path="enrollments/view" element={<ViewMyEnrollments />} />

              <Route path="*" element={<StudentDashboard />} />
            </Route>
          </Route>
        </Route>

        {/* Public Routes */}
        <Route path="/register/student" element={<Addstudent />} />
      </Routes>
    </React.Fragment>
  );
}

export default App;
