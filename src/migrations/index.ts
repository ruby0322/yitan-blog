import * as migration_20260409_155721_initial from './20260409_155721_initial'
import * as migration_20260730_123719_home_page_blocks from './20260730_123719_home_page_blocks'
import * as migration_20260730_204500_section_numbers from './20260730_204500_section_numbers'
import * as migration_20260730_210000_section_numbers_ensure from './20260730_210000_section_numbers_ensure'
import * as migration_20260730_212500_book_sales_block from './20260730_212500_book_sales_block'
import * as migration_20260730_213000_book_sales_block_ensure from './20260730_213000_book_sales_block_ensure'
import * as migration_20260730_214000_book_sales_editorial_fields from './20260730_214000_book_sales_editorial_fields'

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
  {
    up: migration_20260730_212500_book_sales_block.up,
    down: migration_20260730_212500_book_sales_block.down,
    name: '20260730_212500_book_sales_block',
  },
  {
    up: migration_20260730_213000_book_sales_block_ensure.up,
    down: migration_20260730_213000_book_sales_block_ensure.down,
    name: '20260730_213000_book_sales_block_ensure',
  },
  {
    up: migration_20260730_214000_book_sales_editorial_fields.up,
    down: migration_20260730_214000_book_sales_editorial_fields.down,
    name: '20260730_214000_book_sales_editorial_fields',
  },
]
