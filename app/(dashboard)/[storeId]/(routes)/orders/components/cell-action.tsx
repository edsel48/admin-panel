import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

// @ts-ignore
const CellAction: React.FC = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <Button
        onClick={() => {
          router.push(`/${params.storeId}/orders/${data.id}`);
        }}
      >
        Detail
      </Button>
    </>
  );
};

export default CellAction;
