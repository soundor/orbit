import { createFileRoute, notFound } from '@tanstack/react-router';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  PageFooter,
} from 'fumadocs-ui/layouts/docs/page';
import type { ComponentProps } from 'react';

import { getMDXComponents } from '../../components/mdx';
import { PageLegal } from '../../components/site-footer';
import { layoutOptions } from '../../layout-options';
import { source } from '../../source';

export const Route = createFileRoute('/docs/$')({
  loader: ({ params }) => {
    const slugs = params._splat?.split('/').filter(Boolean) ?? [];
    const page = source.getPage(slugs);
    if (!page) throw notFound();
    return {
      slugs,
      title: page.data.title,
      description: page.data.description,
    };
  },
  head: ({ loaderData }) => ({
    meta: loaderData && [
      { title: `${loaderData.title} | Soundor Orbit` },
      { name: 'description', content: loaderData.description },
    ],
  }),
  component: Documentation,
});

function Documentation() {
  const { slugs, title, description } = Route.useLoaderData();
  const page = source.getPage(slugs)!;
  const Content = page.data.body;
  return (
    <DocsLayout
      {...layoutOptions}
      // The sidebar lists the docs, the changelog among them.
      links={[]}
      tree={source.getPageTree()}
      sidebar={{ tabs: false }}
    >
      <DocsPage toc={page.data.toc} slots={{ footer: PageFooterWithLegal }}>
        <DocsTitle>{title}</DocsTitle>
        <DocsDescription>{description}</DocsDescription>
        <DocsBody>
          <Content components={getMDXComponents()} />
        </DocsBody>
      </DocsPage>
    </DocsLayout>
  );
}

/** The page's previous and next links, then the site's legal line. */
function PageFooterWithLegal(props: ComponentProps<typeof PageFooter>) {
  return (
    <>
      <PageFooter {...props} />
      <PageLegal />
    </>
  );
}
