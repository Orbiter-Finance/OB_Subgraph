import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
} from 'matchstick-as/assembly/index';
import { Bytes, Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { ChallengeInfoUpdated as ChallengeInfoUpdatedEvent } from '../src/types/templates/MDC/MDC';
import { handleChallengeInfoUpdated } from '../src/mappings/mdc';
import { createChallengeInfoUpdatedEvent } from './mdc-utils';
import { entity } from '../src/mappings/utils';
import {
  functionCheckChallengeInput,
  functionrChallengeinput,
  mockChallengeFunctionSelector,
} from './mock-data';
import { challengeENUM, challengeStatuses } from '../src/mappings/mdc-core';
import { customData } from '../src/mappings/helpers';

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe('test MDC create Challenge related function', () => {
  const challengeManagerId =
    '0xedc3c682acd3f5ced9441e7581543e5caea5b0a2f7074749980b688659bc88ef';
  const ChallengeId: string = '0x123456';
  const Challenger: string = '0xc3c7a782dda00a8e61cb9ba0ea8680bb3f3b9d10';
  const CreateChallengeID: string =
    '0x31a96bafce95b2a2bce07a0deb4d63c5a5fe8addb6b09d28d8d51f3def93d343';
  const mdcAddr: string = '0xa16081f360e3847006db660bae1c6d1b2e17ec2a';
  const checkChallenge_mockChallenger: string =
    '0xafcfbb382b28dae47b76224f24ee29be2c823648';
  beforeAll(() => {
    const mockChallengeInput = mockChallengeFunctionSelector(
      challengeStatuses[challengeENUM.CREATE],
    );
    let challengeId = Bytes.fromHexString(ChallengeId);
    let freezeToken: Address = Address.fromString(
      '0x5f9204bc7402d77d8c9baa97d8f225e85347961e',
    );
    let statementTuple: Array<ethereum.Value> = [
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromAddress(freezeToken),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
    ];
    let statementInfo = changetype<ethereum.Tuple>(statementTuple);

    let winner: Address = Address.fromString(
      '0x5f9204bc7402d77d8c9baa97d8f225e85347961e',
    );
    let resultTuple: Array<ethereum.Value> = [
      ethereum.Value.fromAddress(winner),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ethereum.Value.fromBytes(
        Address.fromHexString('0x5f9204bc7402d77d8c9baa97d8f225e85347961e'),
      ),
    ];
    let resultInfo = changetype<ethereum.Tuple>(resultTuple);

    // let challengeInfo = changetype<ethereum.Tuple>(challengeTuple)
    let newChallengeInfoUpdatedEvent = createChallengeInfoUpdatedEvent(
      challengeId,
      statementInfo,
      resultInfo,
    );
    customData.setInput(mockChallengeInput);
    customData.setChallenger(Challenger);
    handleChallengeInfoUpdated(newChallengeInfoUpdatedEvent);
  });

  test('challenger related entities created and stored', () => {
    assert.entityCount('challengeManager', 1);
    assert.entityCount('createChallenge', 1);

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      'challengeManager',
      challengeManagerId,
      'challengeId',
      ChallengeId,
    );

    let createChallengeIdList = new Array<string>();
    createChallengeIdList.push(CreateChallengeID);

    assert.fieldEquals(
      'challengeManager',
      challengeManagerId,
      'createChallenge',
      `[${createChallengeIdList}\]`,
    );

    assert.fieldEquals(
      'createChallenge',
      CreateChallengeID,
      'challengeNodeNumber',
      '0x00000000499602d200000000000001a400000000499602d200000000499602d2',
    );
  });

  describe('test MDC verifySource related function', () => {
    const challengeManagerId =
      '0xedc3c682acd3f5ced9441e7581543e5caea5b0a2f7074749980b688659bc88ef';
    const ChallengeId: string = '0x123456';
    const Challenger: string = '0xc3c7a782dda00a8e61cb9ba0ea8680bb3f3b9d10';
    beforeAll(() => {
      const mockChallengeInput = mockChallengeFunctionSelector(
        challengeStatuses[challengeENUM.VERIFY_SOURCE],
      );
      let challengeId = Bytes.fromHexString(ChallengeId);
      let freezeToken: Address = Address.fromString(
        '0x5f9204bc7402d77d8c9baa97d8f225e85347961e',
      );
      let statementTuple: Array<ethereum.Value> = [
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1111111111)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromAddress(freezeToken),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ];
      let statementInfo = changetype<ethereum.Tuple>(statementTuple);

      let winner: Address = Address.fromString(Challenger);
      let resultTuple: Array<ethereum.Value> = [
        ethereum.Value.fromAddress(winner),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromBytes(
          Address.fromHexString('0x5f9204bc7402d77d8c9baa97d8f225e85347961e'),
        ),
      ];
      let resultInfo = changetype<ethereum.Tuple>(resultTuple);

      // let challengeInfo = changetype<ethereum.Tuple>(challengeTuple)
      let newChallengeInfoUpdatedEvent = createChallengeInfoUpdatedEvent(
        challengeId,
        statementInfo,
        resultInfo,
      );
      customData.setInput(mockChallengeInput);
      customData.setChallenger(Challenger);
      handleChallengeInfoUpdated(newChallengeInfoUpdatedEvent);
    });

    test('verifySource related entities created and stored', () => {
      assert.entityCount('challengeManager', 1);
      assert.entityCount('createChallenge', 1);

      assert.fieldEquals(
        'challengeManager',
        challengeManagerId,
        'sourceTxFrom',
        BigInt.fromI32(1111111111).toHexString(),
      );
    });
  });

  describe('test MDC verifyDest related function', () => {
    const challengeManagerId =
      '0xedc3c682acd3f5ced9441e7581543e5caea5b0a2f7074749980b688659bc88ef';
    const ChallengeId: string = '0x123456';
    const Challenger: string = '0xc3c7a782dda00a8e61cb9ba0ea8680bb3f3b9d10';
    beforeAll(() => {
      const mockChallengeInput = mockChallengeFunctionSelector(
        challengeStatuses[challengeENUM.VERIFY_DEST],
      );
      let challengeId = Bytes.fromHexString(ChallengeId);
      let freezeToken: Address = Address.fromString(
        '0x5f9204bc7402d77d8c9baa97d8f225e85347961e',
      );
      let statementTuple: Array<ethereum.Value> = [
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromAddress(freezeToken),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ];
      let statementInfo = changetype<ethereum.Tuple>(statementTuple);

      let winner: Address = Address.fromString(Challenger);
      let resultTuple: Array<ethereum.Value> = [
        ethereum.Value.fromAddress(winner),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromBytes(
          Address.fromHexString('0x5f9204bc7402d77d8c9baa97d8f225e85347961e'),
        ),
      ];
      let resultInfo = changetype<ethereum.Tuple>(resultTuple);

      // let challengeInfo = changetype<ethereum.Tuple>(challengeTuple)
      let newChallengeInfoUpdatedEvent = createChallengeInfoUpdatedEvent(
        challengeId,
        statementInfo,
        resultInfo,
      );
      customData.setInput(mockChallengeInput);
      handleChallengeInfoUpdated(newChallengeInfoUpdatedEvent);
    });

    test('verifySource related entities created and stored', () => {
      assert.entityCount('challengeManager', 1);
      assert.entityCount('createChallenge', 1);

      assert.fieldEquals(
        'challengeManager',
        challengeManagerId,
        'challengeDestVerifier',
        '0xa16081f360e3847006db660bae1c6d1b2e17ec2a',
      );
    });
  });

  describe('test MDC challenge Liquidation related function', () => {
    const challengeManagerId =
      '0xedc3c682acd3f5ced9441e7581543e5caea5b0a2f7074749980b688659bc88ef';
    const ChallengeId: string = '0x123456';
    const Challenger: string = '0xa16081f360e3847006db660bae1c6d1b2e17ec2a';
    const CreateChallengeID: string =
      '0x31a96bafce95b2a2bce07a0deb4d63c5a5fe8addb6b09d28d8d51f3def93d343';
    const mdcAddr: string = '0xa16081f360e3847006db660bae1c6d1b2e17ec2a';
    const checkChallenge_mockChallenger: string =
      '0xafcfbb382b28dae47b76224f24ee29be2c823648';
    beforeAll(() => {
      const mockChallengeInput = mockChallengeFunctionSelector(
        challengeStatuses[challengeENUM.LIQUIDATION],
      );
      let challengeId = Bytes.fromHexString(ChallengeId);
      let freezeToken: Address = Address.fromString(
        '0x5f9204bc7402d77d8c9baa97d8f225e85347961e',
      );
      let statementTuple: Array<ethereum.Value> = [
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromAddress(freezeToken),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
      ];
      let statementInfo = changetype<ethereum.Tuple>(statementTuple);

      let winner: Address = Address.fromString(
        '0x5f9204bc7402d77d8c9baa97d8f225e85347961e',
      );
      let resultTuple: Array<ethereum.Value> = [
        ethereum.Value.fromAddress(winner),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1234567890)),
        ethereum.Value.fromBytes(
          Address.fromHexString('0x5f9204bc7402d77d8c9baa97d8f225e85347961e'),
        ),
      ];
      let resultInfo = changetype<ethereum.Tuple>(resultTuple);

      // let challengeInfo = changetype<ethereum.Tuple>(challengeTuple)
      let newChallengeInfoUpdatedEvent = createChallengeInfoUpdatedEvent(
        challengeId,
        statementInfo,
        resultInfo,
      );
      customData.setInput(mockChallengeInput);
      handleChallengeInfoUpdated(newChallengeInfoUpdatedEvent);
    });

    test('checkChallenge related entities created and stored', () => {
      assert.entityCount('challengeManager', 1);
      assert.entityCount('createChallenge', 1);

      assert.fieldEquals(
        'createChallenge',
        CreateChallengeID,
        'liquidator',
        '0xa16081f360e3847006db660bae1c6d1b2e17ec2a',
      );
    });
  });
});
