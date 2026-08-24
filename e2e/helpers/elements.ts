export type DropSide = "north" | "south" | "east" | "west";

export type PanelElementType = "textarea" | "image" | "icon" | "field" | "table" | "fields";

export const PANEL_SELECTORS = {
  textarea: 'button[item="btnText"]',
  image: 'button[item="btnImage"]',
  icon: 'img.icon-list[item="btnIcon"]',
  field: 'button[item="btnFirst_Name"]',
  table: 'button[item="btnTable"]',
  fields: 'button[item="btnFields"]',
} as const;

export const SIDE_ZONE_CLASS: Record<DropSide, string> = {
  north: ".north.ns.drop",
  south: ".south.ns.drop",
  east: ".east.drop.we",
  west: ".west.drop.we",
};

export function panelSelectorFor(type: PanelElementType) {
  return PANEL_SELECTORS[type];
}
