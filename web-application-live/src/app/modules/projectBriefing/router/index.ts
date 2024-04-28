import { routesNames } from "router/routeNames";
import ProjectBriefing from "..";
import ProjectBriefingForm from "../pages/projectBriefingForm";

const ProjectBriefingRoutes = () => {
  return [
    {
      path: routesNames.PROJECT_BRIEFING.root,
      component: ProjectBriefing,
      isPublic: false,
      isExact: false,
      children: [
        {
          path: routesNames.PROJECT_BRIEFING.children.PROJECT_BRIEFING_FORM,
          component: ProjectBriefingForm,
          isExact: true,
          children: [],
        },
      ],
    },
  ];
};

export default ProjectBriefingRoutes;
