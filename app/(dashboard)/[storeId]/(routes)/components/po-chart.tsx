import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import axios from 'axios';
import useCart from '@/hooks/use-supplier-transaction';

const Header = ({ status, color }: { status: string; color: string }) => {
  return (
    <div className="flex gap-1">
      Laporan Barang dengan status stock{' '}
      <p className={`text-${color}-400`}>{status}</p>
    </div>
  );
};

const ProductCard = ({
  productName,
  sizeStock,
  minStock,
}: {
  productName: string;
  sizeStock: number;
  minStock: number;
}) => {
  return (
    <Card>
      <CardHeader>
        {/* @ts-ignore */}
        <CardTitle>{productName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex-col gap-3">
          {/* @ts-ignore */}
          <div>Stock : {sizeStock}</div>
          {/* @ts-ignore */}
          <div>Minimum Stock : {minStock} </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PoChart = () => {
  let [criticalProducts, setCriticalProducts] = useState([]);
  let [mediumProducts, setMediumProducts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      let response = await axios.get('/api/reports/po');

      let { data } = response;
      //   @ts-ignore
      let critical = data;

      //   @ts-ignore
      setCriticalProducts(critical);
    };

    fetch();
  }, []);

  return (
    <div className="h-full flex-col gap-5">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>
              <Header status="Critical" color="red" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {criticalProducts.length == 0 ? (
                <>Item Not Found</>
              ) : (
                criticalProducts.map((e) => {
                  return (
                    <ProductCard
                      // @ts-ignore
                      productName={e.product.name}
                      // @ts-ignore
                      sizeStock={e.total}
                      // @ts-ignore
                      minStock={e.product.minimumStock}
                    />
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PoChart;
