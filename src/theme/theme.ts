import { Overloadable } from ".";
import colors from "./colors";
import typography from "./typography";
import variants from "./variants";
import styles from "./styles";

const radii = [0, 2, 4, 8] as Overloadable<number[], number>;
radii.card = radii[3];

const borders = {
  solid: "1px solid"
};

const breakpoints = ["40em", "52em", "64em"];

const space = [0, 4, 8, 16, 32, 64, 128, 256, 512];

const sizes = {
  container: 850 // This is currently only used on bookdetails. Might be useful elsewhere tho. We'll see
};

const zIndices = {
  hide: -1,
  base: 0,
  modal: 1000,
  skipNavigation: 2000
};

const shadows = {
  modal: "0px 2px 7px 3px rgba(0,0,0,0.3)"
};

const theme = {
  colors,
  ...typography,
  breakpoints,
  space,
  sizes,
  zIndices,
  shadows,
  radii,
  borders,
  styles,
  ...variants
};

export default theme;
