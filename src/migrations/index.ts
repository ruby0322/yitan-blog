import * as migration_20260409_155721_initial from './20260409_155721_initial'
import * as migration_20260730_123719_home_page_blocks from './20260730_123719_home_page_blocks'
import * as migration_20260730_204500_section_numbers from './20260730_204500_section_numbers'
import * as migration_20260730_210000_section_numbers_ensure from './20260730_210000_section_numbers_ensure'

export const migrations = [
  {
    up: migration_20260409_155721_initial.up,
    down: migration_20260409_155721_initial.down,
    name: '20260409_155721_initial',
  },
  {
    up: migration_20260730_123719_home_page_blocks.up,
    down: migration_20260730_123719_home_page_blocks.down,
    name: '20260730_123719_home_page_blocks',
  },
  {
    up: migration_20260730_204500_section_numbers.up,
    down: migration_20260730_204500_section_numbers.down,
    name: '20260730_204500_section_numbers',
  },
  {
    up: migration_20260730_210000_section_numbers_ensure.up,
    down: migration_20260730_210000_section_numbers_ensure.down,
    name: '20260730_210000_section_numbers_ensure',
  },
]
