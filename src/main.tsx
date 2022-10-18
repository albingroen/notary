import "./style.css";
import Note from "./views/Note";
import ReactDOM from "react-dom/client";
import Start from "./views/Start";
import { QueryClient, QueryClientProvider } from "react-query";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

const router = createMemoryRouter([
  {
    path: "/",
    element: <Start />,
    children: [
      {
        path: "notes/:noteName",
        element: <Note />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
