import * as migration_20260409_155721_initial from './20260409_155721_initial'
import * as migration_20260730_123719_home_page_blocks from './20260730_123719_home_page_blocks'
import * as migration_20260730_204500_section_numbers from './20260730_204500_section_numbers'
import * as migration_20260730_210000_section_numbers_ensure from './20260730_210000_section_numbers_ensure'
import * as migration_20260730_212500_book_sales_block from './20260730_212500_book_sales_block'
import * as migration_20260730_213000_book_sales_block_ensure from './20260730_213000_book_sales_block_ensure'
import * as migration_20260730_214000_book_sales_editorial_fields from './20260730_214000_book_sales_editorial_fields'
import * as migration_20260730_220000_about_teaser_editorial_fields from './20260730_220000_about_teaser_editorial_fields'
import * as migration_20260730_230000_footer_link_groups from './20260730_230000_footer_link_groups'
import * as migration_20260731_120000_features_block from './20260731_120000_features_block'

import * as migration_20260731_123000_category_nav_carousel from './20260731_123000_category_nav_carousel'
import * as migration_20260731_132500_post_excerpt_faq_marketing from './20260731_132500_post_excerpt_faq_marketing'
import * as migration_20260731_151800_clear_page_default_og_images from './20260731_151800_clear_page_default_og_images'
import * as migration_20260731_170000_remove_about_content_direction from './20260731_170000_remove_about_content_direction'
import * as migration_20260731_181500_remove_footer_doctor_link_group from './20260731_181500_remove_footer_doctor_link_group'
import * as migration_20260731_182100_remove_footer_terms_link from './20260731_182100_remove_footer_terms_link'
import * as migration_20260802_000000_category_sort_order from './20260802_000000_category_sort_order'
import * as migration_20260802_000001_search_categories_sort_order from './20260802_000001_search_categories_sort_order'

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
  {
    up: migration_20260730_220000_about_teaser_editorial_fields.up,
    down: migration_20260730_220000_about_teaser_editorial_fields.down,
    name: '20260730_220000_about_teaser_editorial_fields',
  },
  {
    up: migration_20260730_230000_footer_link_groups.up,
    down: migration_20260730_230000_footer_link_groups.down,
    name: '20260730_230000_footer_link_groups',
  },
  {
    up: migration_20260731_120000_features_block.up,
    down: migration_20260731_120000_features_block.down,
    name: '20260731_120000_features_block',
  },
  {
    up: migration_20260731_123000_category_nav_carousel.up,
    down: migration_20260731_123000_category_nav_carousel.down,
    name: '20260731_123000_category_nav_carousel',
  },
  {
    up: migration_20260731_132500_post_excerpt_faq_marketing.up,
    down: migration_20260731_132500_post_excerpt_faq_marketing.down,
    name: '20260731_132500_post_excerpt_faq_marketing',
  },
  {
    up: migration_20260731_151800_clear_page_default_og_images.up,
    down: migration_20260731_151800_clear_page_default_og_images.down,
    name: '20260731_151800_clear_page_default_og_images',
  },
  {
    up: migration_20260731_170000_remove_about_content_direction.up,
    down: migration_20260731_170000_remove_about_content_direction.down,
    name: '20260731_170000_remove_about_content_direction',
  },
  {
    up: migration_20260731_181500_remove_footer_doctor_link_group.up,
    down: migration_20260731_181500_remove_footer_doctor_link_group.down,
    name: '20260731_181500_remove_footer_doctor_link_group',
  },
  {
    up: migration_20260731_182100_remove_footer_terms_link.up,
    down: migration_20260731_182100_remove_footer_terms_link.down,
    name: '20260731_182100_remove_footer_terms_link',
  },
  {
    up: migration_20260802_000000_category_sort_order.up,
    down: migration_20260802_000000_category_sort_order.down,
    name: '20260802_000000_category_sort_order',
  },
  {
    up: migration_20260802_000001_search_categories_sort_order.up,
    down: migration_20260802_000001_search_categories_sort_order.down,
    name: '20260802_000001_search_categories_sort_order',
  },
]
