# Blot Map

A blot program that generates a map with a river, trees and a city with houses, trees and a road

## Configuration

You can set a seed by setting the `seed` constant

### River Options

- maxAngleTan: Tangent of maximum angle the river can make from the vertical axis
- paddingX: Padding from the sides
- paddingY: Padding from the top and bottom for the second and last control point respectively
- maxWidth: Maximum width of the river
- minWidth: Minimum width of the river

### Tree Options

- N: Number of trees
- paddingX: Padding from the sides
- paddingY: Padding from the top and bottom
- riverDistance: Minimum distance from the river

### Fish Options

- N: Number of fish
- padding: Minimum distance between fish (as fraction of the length of the river)
- maxSize: Maximum size multiplier
- minSize: Minimum size multiplier
- angleVariation: Maximum variation from river angle

### House Options

- chimneyChance: Chance of having a chimney 
- windowChance: Chance of having a window

### City Options

- criticalSize: Number of houses after which the probability of generating another one drops
- firstRiverDistance: Minimum distance from the river for the first house
- padding: Padding for the city
- riverDistance: Minimum distance from the river for all houses
- skipChance: Chance to skip drawing a house
- treeReplaceChance: Chance to draw a tree insted of skipping a house

### Road Option

- dashSize: Size of dashes in the center of the road