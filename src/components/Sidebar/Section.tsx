import React from "react";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  marginLeft: theme.spacing(2),
}));

type SectionProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export default function Section(props: SectionProps): JSX.Element {
  const { title, children, className } = props;
  return (
    <div className={className}>
      <SectionTitle variant="subtitle1">{title}</SectionTitle>
      {children}
    </div>
  );
}
