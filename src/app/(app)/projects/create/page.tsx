"use client";

import { Box } from "@mui/material";

import { FormCreateProject } from "./FormCreateProject";

const ProjectCreatePage = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      width="100%"
    >
      <FormCreateProject />
    </Box>
  );
};

export default ProjectCreatePage;
