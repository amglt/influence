import { Col, Form, InputNumber, Row, Typography, Divider, Button } from 'antd';
import { Breadcrumb } from '@Components/Breadcrumb';
import { Content } from '@Components/Content';
import { useScale } from '@Api/pvp-management/pvp-management.queries';
import { useForm } from 'antd/lib/form/Form';
import { useSaveScale } from '@Api/pvp-management/pvp-management.mutations';
import { useSelector } from '@Store/';
import { AppPermissions } from '@Models/root.models';

const { Title } = Typography;

export function Scale() {
  const { user } = useSelector((state) => state.root);

  const { data: scaleData } = useScale();
  const { mutate: saveScale } = useSaveScale();
  const [form] = useForm();

  const onSaveScale = (values: any) => {
    saveScale({
      percoAttackWinPoints: values.percoAttackWin,
      percoAttackLoosePoints: values.percoAttackLoose,
      percoDefWinPoints: values.percoDefWin,
      percoDefLoosePoints: values.percoDefLoose,
      percoNDPoints: values.percoND,
      prismAttackWinPoints: values.prismAttackWin,
      prismAttackLoosePoints: values.prismAttackLoose,
      prismDefWinPoints: values.prismDefWin,
      prismDefLoosePoints: values.prismDefLoose,
      prismNDPoints: values.prismND,
      bigPercoAttackWinPoints: values.bigPercoAttackWin,
      bigPercoAttackLoosePoints: values.bigPercoAttackLoose,
      bigPercoDefWinPoints: values.bigPercoDefWin,
      bigPercoDefLoosePoints: values.bigPercoDefLoose,
      bigPercoNDPoints: values.bigPercoND,
      bigPrismAttackWinPoints: values.bigPrismAttackWin,
      bigPrismAttackLoosePoints: values.bigPrismAttackLoose,
      bigPrismNDPoints: values.bigPrismND,
      bigPrismDefWinPoints: values.bigPrismDefWin,
      bigPrismDefLoosePoints: values.bigPrismDefLoose,
      avaWin: values.avaWin,
      avaLoose: values.avaLoose,
    });
  };

  const canEditScale = user.permissions.includes(AppPermissions.WriteScale);

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
            initialValues={{
              percoAttackWin: scaleData.percoAttackWinPoints,
              percoAttackLoose: scaleData.percoAttackLoosePoints,
              percoDefWin: scaleData.percoDefWinPoints,
              percoDefLoose: scaleData.percoDefLoosePoints,
              percoND: scaleData.percoNDPoints,
              prismAttackWin: scaleData.prismAttackWinPoints,
              prismAttackLoose: scaleData.prismAttackLoosePoints,
              prismDefWin: scaleData.prismDefWinPoints,
              prismDefLoose: scaleData.prismDefLoosePoints,
              prismND: scaleData.prismNDPoints,
              bigPercoAttackWin: scaleData.bigPercoAttackWinPoints,
              bigPercoAttackLoose: scaleData.bigPercoAttackLoosePoints,
              bigPercoDefWin: scaleData.bigPercoDefWinPoints,
              bigPercoDefLoose: scaleData.bigPercoDefLoosePoints,
              bigPercoND: scaleData.bigPercoNDPoints,
              bigPrismAttackWin: scaleData.bigPrismAttackWinPoints,
              bigPrismAttackLoose: scaleData.bigPrismAttackLoosePoints,
              bigPrismND: scaleData.bigPrismNDPoints,
              bigPrismDefWin: scaleData.bigPrismDefWinPoints,
              bigPrismDefLoose: scaleData.bigPrismDefLoosePoints,
              avaWin: scaleData.avaWin,
              avaLoose: scaleData.avaLoose,
            }}
            onFinish={onSaveScale}
          >
            {canEditScale ? (
              <Row>
                <Col span={24}>
                  <Form.Item>
                    <Button type="primary" htmlType={'submit'}>
                      Enregistrer
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            ) : undefined}
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
                    name={'bigPercoAttackWin'}
                    label={'Big perco attack win'}
                    rules={[{ required: true }]}
                  >
                    <InputNumber disabled={!canEditScale} min={0} step={0.01} />
                  </Form.Item>
                  <Form.Item
                    name={'bigPercoAttackLoose'}
                    label={'Big perco attack loose'}
                    rules={[{ required: true }]}
                  >
                    <InputNumber disabled={!canEditScale} min={0} step={0.01} />
                  </Form.Item>
                  <Form.Item
                    name={'bigPercoND'}
                    label={'Big perco no def'}
                    rules={[{ required: true }]}
                  >
                    <InputNumber disabled={!canEditScale} min={0} step={0.01} />
                  </Form.Item>
                  <Form.Item
                    name={'bigPercoDefWin'}
                    label={'Big perco def win'}
                    rules={[{ required: true }]}
                  >
                    <InputNumber disabled={!canEditScale} min={0} step={0.01} />
                  </Form.Item>
                  <Form.Item
                    name={'bigPercoDefLoose'}
                    label={'Big perco def loose'}
                    rules={[{ required: true }]}
                  >
                    <InputNumber disabled={!canEditScale} min={0} step={0.01} />
                  </Form.Item>
                  <Form.Item
                    name={'bigPrismAttackWin'}
                    label={'Big prisme attack win'}
                    rules={[{ required: true }]}
                  >
                    <InputNumber disabled={!canEditScale} min={0} step={0.01} />
                  </Form.Item>
                  <Form.Item
                    name={'bigPrismAttackLoose'}
                    label={'Big prisme attack loose'}
                    rules={[{ required: true }]}
                  >
                    <InputNumber disabled={!canEditScale} min={0} step={0.01} />
                  </Form.Item>
                  <Form.Item
                    name={'bigPrismND'}
                    label={'Big prisme no def'}
                    rules={[{ required: true }]}
                  >
                    <InputNumber disabled={!canEditScale} min={0} step={0.01} />
                  </Form.Item>
                  <Form.Item
                    name={'bigPrismDefWin'}
                    label={'Big prisme def win'}
                    rules={[{ required: true }]}
                  >
                    <InputNumber disabled={!canEditScale} min={0} step={0.01} />
                  </Form.Item>
                  <Form.Item
                    name={'bigPrismDefLoose'}
                    label={'Big prisme def loose'}
                    rules={[{ required: true }]}
                  >
                    <InputNumber disabled={!canEditScale} min={0} step={0.01} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name={'percoAttackWin'}
                    label={'Perco attack win'}
                    rules={[{ required: true }]}
                  >
                    <InputNumber disabled={!canEditScale} min={0} step={0.01} />
                  </Form.Item>
                  <Form.Item
                    name={'percoAttackLoose'}
                    label={'Perco attack loose'}
                    rules={[{ required: true }]}
                  >
                    <InputNumber disabled={!canEditScale} min={0} step={0.01} />
                  </Form.Item>
                  <Form.Item
                    name={'percoND'}
                    label={'Perco no def'}
                    rules={[{ required: true }]}
                  >
                    <InputNumber disabled={!canEditScale} min={0} step={0.01} />
                  </Form.Item>
                  <Form.Item
                    name={'percoDefWin'}
                    label={'Perco def win'}
                    rules={[{ required: true }]}
                  >
                    <InputNumber disabled={!canEditScale} min={0} step={0.01} />
                  </Form.Item>
                  <Form.Item
                    name={'percoDefLoose'}
                    label={'Perco def loose'}
                    rules={[{ required: true }]}
                  >
                    <InputNumber disabled={!canEditScale} min={0} step={0.01} />
                  </Form.Item>
                  <Form.Item
                    name={'prismAttackWin'}
                    label={'Prisme attack win'}
                    rules={[{ required: true }]}
                  >
                    <InputNumber disabled={!canEditScale} min={0} step={0.01} />
                  </Form.Item>
                  <Form.Item
                    name={'prismAttackLoose'}
                    label={'Prisme attack loose'}
                    rules={[{ required: true }]}
                  >
                    <InputNumber disabled={!canEditScale} min={0} step={0.01} />
                  </Form.Item>
                  <Form.Item
                    name={'prismND'}
                    label={'Prism no def'}
                    rules={[{ required: true }]}
                  >
                    <InputNumber disabled={!canEditScale} min={0} step={0.01} />
                  </Form.Item>
                  <Form.Item
                    name={'prismDefWin'}
                    label={'Prisme def win'}
                    rules={[{ required: true }]}
                  >
                    <InputNumber disabled={!canEditScale} min={0} step={0.01} />
                  </Form.Item>
                  <Form.Item
                    name={'prismDefLoose'}
                    label={'Prisme def loose'}
                    rules={[{ required: true }]}
                  >
                    <InputNumber disabled={!canEditScale} min={0} step={0.01} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name={'avaWin'}
                    label={'AvA win'}
                    rules={[{ required: true }]}
                  >
                    <InputNumber disabled={!canEditScale} min={0} step={0.01} />
                  </Form.Item>
                  <Form.Item
                    name={'avaLoose'}
                    label={'AvA loose'}
                    rules={[{ required: true }]}
                  >
                    <InputNumber disabled={!canEditScale} min={0} step={0.01} />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Form>
        ) : undefined}
      </Content>
    </>
  );
}
