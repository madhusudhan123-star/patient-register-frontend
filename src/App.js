import './App.css';
import HospitalPatientForm from './page/HospitalPatientForm';
import PatientDataHomePage from './page/PatientDataHomePage';
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PatientDataHomePage />,
  },
  {
    path: "/patient-form",
    element: <HospitalPatientForm />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;