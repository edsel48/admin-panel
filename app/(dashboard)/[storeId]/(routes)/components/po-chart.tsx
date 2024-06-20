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

const PoChart = () => {
  const addItems = useCart((state) => state.addItem);

  let [criticalProducts, setCriticalProducts] = useState([]);
  let [mediumProducts, setMediumProducts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      let response = await axios.get('/api/reports/po');

      let { data } = response;
      //   @ts-ignore
      let critical = [];
      // @ts-ignore
      let medium = [];

      //   @ts-ignore
      data.forEach((e) => {
        if (e.status == 'CRITICAL') {
          critical.push(e);
        }
        if (e.status == 'MEDIUM') {
          medium.push(e);
        }
      });

      //   @ts-ignore
      setCriticalProducts(critical);
      //   @ts-ignore
      setMediumProducts(medium);
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
                  return <>Something </>;
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-5">
        <Separator />
      </div>
      <div className="mt-5">
        <Card>
          <CardHeader>
            <CardTitle>
              <Header status="Medium" color="yellow" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {mediumProducts.length == 0 ? (
                <>Item Not Found</>
              ) : (
                mediumProducts.map((e) => {
                  return (
                    <div>
                      {/* @ts-ignore */}
                      {e.product.name}
                    </div>
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
