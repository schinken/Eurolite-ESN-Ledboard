module.exports = {

  Control: {
    HEAD: '\x01\x5A\x30\x30\x02\x41\x58',
    HALF_SPACE: '\x82',
    END: '\x04',
    FLASH: '\x07',
    PATTERN_IN: '\x06\x0aI',
    PATTERN_OUT: '\x06\x0aO',
    SPECIAL: '\x0B',
    FRAME: '\x0C',
    SPEED: '\x0F',
    LINE_FEED: '\x0D',
    FONT_COLOR: '\x1C',
    BACKGROUND_COLOR: '\x1D',
    ALIGN_HORIZONAL: '\x1E',
    ALIGN_VERTICAL: '\x1F'
  },

  Flash: {
    OFF: '\x30',
    ON: '\x31'
  },

  Special: {
    MM_DD_YY_SLASH: '\x20',
    DD_MM_YY_SLASH: '\x21',
    MM_DD_YY_DASH: '\x22',
    DD_MM_YY_DASH: '\x23',
    MM_DD_YYYY_DOT: '\x24',
    YY: '\x25',
    YYYY: '\x26',
    MM: '\x27',
    MMM: '\x28',
    DD: '\x29',
    DD_OF_WEEK: '\x2A',
    DDD_OF_WEEK: '\x2B',
    HH: '\x2C',
    MIN: '\x2D',
    SEC: '\x2E',
    HH_MIN_24: '\x2F',
    HH_MIN_12: '\x30'
  },

  Pattern: {
    RANDOM:  '\x2F',
    JUMP_OUT: '\x30',
    MOVE_LEFT: '\x31',
    MOVE_RIGHT: '\x32',
    SCROLL_LEFT: '\x33',
    SCROLL_RIGHT: '\x34',
    MOVE_UP: '\x35',
    MOVE_DOWN: '\x36',
    SCROLL_LR: '\x37',
    SCROLL_UP: '\x38',
    SCROLL_DOWN: '\x39',
    FOLD_LR: '\x3A',
    FOLD_UD: '\x3B',
    SCROLL_UD: '\x3C',
    SHUTTLE_LR: '\x3D',
    SHUTTLE_UD: '\x3E',
    PEEL_OFF_L: '\x3F',
    PEEL_OFF_R: '\x40',
    SHUTTER_UD: '\x41',
    SHUTTER_LR: '\x42',
    RAINDROPS: '\x43',
    RANDOM_MOSAIC: '\x44',
    TWINKLING_STAR: '\x45',
    HIP_HOP: '\x46',
    RADAR_SCAN: '\x47',
    FAN_OUT: '\x48',
    FAN_IN: '\x49',
    SPIRAL_R: '\x4A',
    SPIRAL_L: '\x4B',
    TO_FOUR_CORNERS: '\x4C',
    FROM_FOUR_CORNERS: '\x4D',
    TO_FOUR_SIDES: '\x4E',
    FROM_FOUR_SODES: '\x4F',
    SCROLL_OUT_FORM_FOUR_BLOCKS: '\x50'
  },

  Pause: {
    SECOND_2: '\x0E\x30',
    SECOND_4: '\x0E\x32',
    MILLISECOND_2: '\x0E\x31',
    MILLISECOND_4: '\x0E\x33'
  },

  Align: {
    HORIZONTAL_CENTER: '\x30',
    HORIZONTAL_LEFT: '\x31',
    HORIZONTAL_RIGHT: '\x32',
    HORIZONTAL_RESERVED: '\x33',

    VERTICAL_CENTER: '\x30',
    VERTICAL_TOP: '\x31',
    VERTICAL_BOTTOM: '\x32',
    VERTICAL_RESERVED: '\x33'
  },

  BackgroundColor: {
    BLACK: '\x30',
    RED: '\x31',
    GREEN: '\x32',
    YELLOW: '\x33'
  },

  FontColor: {
    BLACK: '\x30',
    RED: '\x31',
    GREEN: '\x32',
    YELLOW: '\x33',
    YGR_CHARACTER: '\x34',
    YGR_HORIZONTAL: '\x35',
    YGR_WAVE: '\x36',
    YGR_DIAGONAL: '\x37'
  },

  Speed: {
    VERY_FAST: '\x30',
    FAST: '\x31',
    MEDIUM_FAST: '\x32',
    MEDIUM: '\x33',
    MEDIUM_SLOW: '\x34',
    SLOW: '\x35',
    VERY_SLOW: '\x36'
  }

};
