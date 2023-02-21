import styled from 'styled-components';

export const BaseButton = styled.button`
  min-width: 165px;
  width: auto;
  height: 50px;
  letter-spacing: 0.5px;
  line-height: 50px;
  padding: 0 35px 0 35px;
  font-size: 15px;
  background-color: black;
  color: white;
  text-transform: uppercase;
  font-family: 'Open Sans Condensed';
  font-weight: bolder;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  transition: 0.4s;
  border-radius: 2px;

  &:hover {
    transition: 0.4s;
    background-color: white;
    color: black;
  }
`;

export const GoogleSignInButton = styled(BaseButton)`
  background-color: #71bdde;
  color: white;
  transition: 0.4s;

  &:hover {
    transition: 0.4s;
    border: none;
  }
`;

export const InvertedButton = styled(BaseButton)`
  background-color: white;
  color: black;
  border: 1px solid black;

  &:hover {
    background-color: black;
    color: white;
    border: none;
  }
`;
