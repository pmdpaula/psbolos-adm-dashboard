"use client";

import { alpha, Box, styled } from "@mui/material";

interface NeonCircleProps {
  diameter?: number;
  children?: React.ReactNode;
}

const StyledBox = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  // background: "linear-gradient(45deg, #ff0080, #ff8c00)",
  background: theme.palette.background.paper,
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: "50%",
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    boxShadow: `0 0 20px ${theme.palette.primary.main}`,
    animation:
      "neonPulse 2s ease-in-out infinite alternate, rotate 3s linear infinite",
    zIndex: -1,
  },
  "@keyframes neonPulse": {
    "0%": {
      boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.5)}`,
    },
    "100%": {
      boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.8)}, 0 0 35px ${alpha(theme.palette.tertiary.main, 0.4)}`,
    },
  },
  "@keyframes rotate": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
}));

// const StyledBox = styled(Box)({
//   position: "relative",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   borderRadius: "50%",
//   // background: "linear-gradient(45deg, #ff0080, #ff8c00)",
//   background: "#240012",
//   "&::before": {
//     content: '""',
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     borderRadius: "50%",
//     background: "linear-gradient(45deg, #ff0080, #ff8c00)",
//     boxShadow: "0 0 20px rgba(255, 0, 128, 0.5)",
//     animation:
//       "neonPulse 2s ease-in-out infinite alternate, rotate 3s linear infinite",
//     zIndex: -1,
//   },
//   "@keyframes neonPulse": {
//     "0%": {
//       boxShadow: "0 0 20px rgba(255, 0, 128, 0.5)",
//     },
//     "100%": {
//       boxShadow:
//         "0 0 20px rgba(255, 0, 128, 0.8), 0 0 35px rgba(255, 140, 0, 0.4)",
//     },
//   },
//   "@keyframes rotate": {
//     "0%": {
//       transform: "rotate(0deg)",
//     },
//     "100%": {
//       transform: "rotate(360deg)",
//     },
//   },
// });

export const NeonCircle = ({ diameter = 20, children }: NeonCircleProps) => {
  return (
    <StyledBox
      width={diameter}
      height={diameter}
      // bgcolor="white"
    >
      <Box
        // bgcolor="tomato"
        width="100%"
        height="100%"
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="50%"
        overflow="hidden"
      >
        {children}
      </Box>
    </StyledBox>
  );
};
