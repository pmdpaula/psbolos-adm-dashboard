import { type Palette, Typography, type TypographyProps } from "@mui/material";

interface SimpleDataTextProps {
  description: string;
  value: string | number;
}

export const SimpleDataText = ({ description, value }: SimpleDataTextProps) => {
  return (
    <Typography
      variant="body2"
      gutterBottom
      color="textSecondary"
    >
      {description}
      <Typography
        fontWeight="bold"
        component="span"
        color="textPrimary"
      >
        {value}
      </Typography>
    </Typography>
  );
};

interface ColoredDataTextProps extends TypographyProps {
  description: string;
  value: string | number;
  textColor: "primary" | "secondary" | "tertiary" | keyof Palette;
}

export const ColoredDataText = ({
  description,
  value,
  textColor,
}: ColoredDataTextProps) => {
  return (
    <Typography
      variant="body2"
      gutterBottom
      color="textSecondary"
    >
      {description}
      <Typography
        fontWeight="bold"
        component="span"
        color={textColor}
      >
        {value}
      </Typography>
    </Typography>
  );
};
