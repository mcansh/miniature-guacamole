import styled from 'styled-components';

const Button = styled.button.attrs(props => ({ type: props.type || 'button' }))`
  border: none;
  background: linear-gradient(225deg, #e65f83 0%, #7d69fc 100%),
    linear-gradient(135deg, #f75b6c 0%, #3da2ed 100%);
  border-radius: 0.8vw;
  font-size: 1.4rem;
  padding: 1.4rem 2.5rem;
  cursor: pointer;
  color: white;
  display: block;
`;

export default Button;
