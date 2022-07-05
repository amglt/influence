import {
  Col,
  Form,
  InputNumber,
  Row,
  Typography,
  Divider,
  Space,
  Button,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Breadcrumb } from '@Components/Breadcrumb';
import { Content } from '@Components/Content';
import { useScale } from '@Api/pvp-management/pvp-management.queries';
import { useForm } from 'antd/lib/form/Form';
import { Key, useState } from 'react';
import { Rate, Scale } from '@Models/pvp-management.models';
import { v4 as uuid } from 'uuid';
import { useSaveScale } from '@Api/pvp-management/pvp-management.mutations';

const { Title } = Typography;

export function Scale() {
  const [rates, setRates] = useState<Rate[]>([]);

  const onGetScaleDataSuccess = (data: Scale) => {
    setRates(data.rates);
  };

  const { data: scaleData } = useScale(onGetScaleDataSuccess);
  const { mutate: saveScale } = useSaveScale();
  const [form] = useForm();

  const onAddRate = () => {
    setRates((prevRates) => [
      ...prevRates,
      {
        id: uuid(),
        rate: 0,
        gamesAmount: 0,
      },
    ]);
  };

  const onDeleteRate = (id: Key) => {
    setRates((prevRates) => prevRates.filter((rate) => rate.id !== id));
  };

  const onSaveScale = (values: any) => {
    saveScale({
      rates: rates.map((rate) => ({
        id: rate.id,
        gamesAmount: values[`gamesAmount-${rate.id}`],
        rate: values[`rate-${rate.id}`],
      })),
      avaLoose: values.avaWin,
      avaWin: values.avaLoose,
      bigPercoLoosePoints: values.bigPercoLoose,
      bigPercoNDPoints: values.bigPercoND,
      bigPercoWinPoints: values.bigPercoWin,
      bigPrismLoosePoints: values.bigPrismLoose,
      bigPrismNDPoints: values.bigPrismND,
      bigPrismWinPoints: values.bigPrismWin,
      prismNDPoints: values.prismND,
      prismLoosePoints: values.prismLoose,
      prismWinPoints: values.prismWin,
      percoLoosePoints: values.percoLoose,
      percoNDPoints: values.percoND,
      percoWinPoints: values.percoWin,
    });
  };

  return (
    <>
      <Breadcrumb
        items={[
          { key: 'pvp-management-management', label: 'PVP Management' },
          { key: 'scale', label: 'Barème' },
        ]}
      />
      <Content>
        {scaleData ? (
          <Form
            key={JSON.stringify(scaleData)}
            form={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={scaleData.rates.reduce(
              (obj, item) => {
                return {
                  ...obj,
                  [`gamesAmount-${item.id}`]: item.gamesAmount,
                  [`rate-${item.id}`]: item.rate,
                };
              },
              {
                bigPercoWin: scaleData.bigPercoWinPoints,
                bigPercoND: scaleData.bigPercoNDPoints,
                bigPercoLoose: scaleData.bigPercoLoosePoints,
                bigPrismWin: scaleData.bigPrismWinPoints,
                bigPrismND: scaleData.bigPrismNDPoints,
                bigPrismLoose: scaleData.bigPrismLoosePoints,
                percoWin: scaleData.prismWinPoints,
                percoND: scaleData.prismNDPoints,
                percoLoose: scaleData.prismLoosePoints,
                prismWin: scaleData.prismWinPoints,
                prismND: scaleData.prismNDPoints,
                prismLoose: scaleData.prismLoosePoints,
                avaWin: scaleData.avaWin,
                avaLoose: scaleData.avaLoose,
              },
            )}
            onFinish={onSaveScale}
          >
            <Space
              direction={'vertical'}
              style={{ display: 'flex' }}
              size={'large'}
            >
              <Row>
                <Col span={24}>
                  <Form.Item>
                    <Button type="primary" htmlType={'submit'}>
                      Enregistrer
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
              <div>
                <Row>
                  <Col span={24}>
                    <Title level={3}>Barème</Title>
                    <Divider />
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <Form.Item
                      name={'bigPercoWin'}
                      label={'Big perco win'}
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={0} step={0.01} />
                    </Form.Item>
                    <Form.Item
                      name={'bigPercoND'}
                      label={'Big perco no def'}
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={0} step={0.01} />
                    </Form.Item>
                    <Form.Item
                      name={'bigPercoLoose'}
                      label={'Big perco loose'}
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={0} step={0.01} />
                    </Form.Item>
                    <Form.Item
                      name={'bigPrismWin'}
                      label={'Big prisme win'}
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={0} step={0.01} />
                    </Form.Item>
                    <Form.Item
                      name={'bigPrismND'}
                      label={'Big prisme no def'}
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={0} step={0.01} />
                    </Form.Item>
                    <Form.Item
                      name={'bigPrismLoose'}
                      label={'Big prisme loose'}
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={0} step={0.01} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name={'percoWin'}
                      label={'Perco win'}
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={0} step={0.01} />
                    </Form.Item>
                    <Form.Item
                      name={'percoND'}
                      label={'Perco no def'}
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={0} step={0.01} />
                    </Form.Item>
                    <Form.Item
                      name={'percoLoose'}
                      label={'Perco loose'}
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={0} step={0.01} />
                    </Form.Item>
                    <Form.Item
                      name={'prismWin'}
                      label={'Prisme win'}
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={0} step={0.01} />
                    </Form.Item>
                    <Form.Item
                      name={'prismND'}
                      label={'Prism no def'}
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={0} step={0.01} />
                    </Form.Item>
                    <Form.Item
                      name={'prismLoose'}
                      label={'Prisme loose'}
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={0} step={0.01} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name={'avaWin'}
                      label={'AvA win'}
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={0} step={0.01} />
                    </Form.Item>
                    <Form.Item
                      name={'avaLoose'}
                      label={'AvA loose'}
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={0} step={0.01} />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
              <div>
                <Row>
                  <Col span={24}>
                    <Title level={3}>Taux régressifs</Title>
                    <Divider />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Button onClick={onAddRate}>Ajouter</Button>
                  </Col>
                </Row>
                {rates.map((rate) => (
                  <Row key={rate.id}>
                    <Col span={8}>
                      <Form.Item
                        name={`gamesAmount-${rate.id}`}
                        label={'Quantité de parties'}
                        rules={[
                          {
                            required: true,
                            message: 'Le nombre de parties est requis',
                          },
                        ]}
                      >
                        <InputNumber min={0} step={1} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name={`rate-${rate.id}`}
                        label={'Taux'}
                        rules={[
                          { required: true, message: 'Le taux est requis' },
                        ]}
                      >
                        <InputNumber min={0} step={0.01} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <DeleteOutlined onClick={() => onDeleteRate(rate.id)} />
                    </Col>
                  </Row>
                ))}
              </div>
            </Space>
          </Form>
        ) : undefined}
      </Content>
    </>
  );
}
