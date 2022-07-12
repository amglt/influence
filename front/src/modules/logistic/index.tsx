import { useAuth0 } from '@auth0/auth0-react';
import { Outlet } from 'react-router-dom';
import { Text } from '@Components/Typography';

export function Logistic() {
  const { user } = useAuth0();

  function render() {
    if (!user) {
      return (
        <div>
          <Text>Vous devez être connecté pour avoir accès à ce contenu</Text>
        </div>
      );
    }
  }

  return !!user ? <Outlet /> : <Text></Text>;
}
