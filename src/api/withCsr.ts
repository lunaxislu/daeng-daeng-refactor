import { GetServerSideProps, GetServerSidePropsContext } from 'next';

export const withConditionalSSR = (next: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
  // url로 진입 한 것인지, 아니면 페이지 내에서 routing 한것인지
  const isCSR = ctx.req.url?.startsWith('/_next');

  if (isCSR) {
    return {
      props: {},
    };
  }

  return next?.(ctx);
};
