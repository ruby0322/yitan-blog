import type { RequiredDataFromCollectionSlug } from 'payload'
import { about } from './about'

export const aboutStatic: RequiredDataFromCollectionSlug<'pages'> = about()
