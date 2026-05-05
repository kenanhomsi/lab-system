"use client";

import { Box } from "@mantine/core";

const AVATAR_BACKGROUNDS = [
  "#E1F5EE",
  "#EEEDFE",
  "#E6F1FB",
  "#FAEEDA",
  "#FAECE7",
] as const;

const AVATAR_FOREGROUNDS = [
  "#085041",
  "#3C3489",
  "#0C447C",
  "#633806",
  "#712B13",
] as const;

function paletteIndexForName(name: string): number {
  const n = name.trim();
  if (!n.length) return 0;
  return n.charCodeAt(0) % AVATAR_BACKGROUNDS.length;
}

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "—";
  if (parts.length === 1) {
    const w = parts[0];
    return (w[0] + (w[1] ?? w[0])).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type Props = { fullName: string };

const UserAvatar = ({ fullName }: Props) => {
  const name = fullName.trim() || "User";
  const idx = paletteIndexForName(name);
  return (
    <Box
      style={{
        width: 32,
        height: 32,
        borderRadius: 9999,
        backgroundColor: AVATAR_BACKGROUNDS[idx],
        color: AVATAR_FOREGROUNDS[idx],
        fontSize: 12,
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        lineHeight: 1,
        fontFeatureSettings: '"tnum"',
      }}
    >
      {getInitials(name)}
    </Box>
  );
};

export { UserAvatar };
