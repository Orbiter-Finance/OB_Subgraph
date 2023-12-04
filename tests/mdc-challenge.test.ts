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
import { challengeENUM, challengeStatues } from '../src/mappings/mdc-core';
import { customData } from '../src/mappings/helpers';

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe('test MDC create Challenge related function', () => {
  const ChallengeId: string = '0x123456';
  const Challenger: string = '0xc3c7a782dda00a8e61cb9ba0ea8680bb3f3b9d10';
  const CreateChallengeID: string =
    '0xdb7a2a51019d786377e1fceeb3c2e1caf928f436a330eb2585e6fd2057100387';
  const mdcAddr: string = '0xa16081f360e3847006db660bae1c6d1b2e17ec2a';
  const checkChallenge_mockChallenger: string =
    '0xafcfbb382b28dae47b76224f24ee29be2c823648';
  beforeAll(() => {
    const mockChallengeInput = mockChallengeFunctionSelector(
      challengeStatues[challengeENUM.CREATE],
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
    assert.fieldEquals('challengeManager', ChallengeId, 'id', ChallengeId);

    let createChallengeIdList = new Array<string>();
    createChallengeIdList.push(CreateChallengeID);

    assert.fieldEquals(
      'challengeManager',
      ChallengeId,
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
    const ChallengeId: string = '0x123456';
    const Challenger: string = '0xc3c7a782dda00a8e61cb9ba0ea8680bb3f3b9d10';
    beforeAll(() => {
      const mockChallengeInput = mockChallengeFunctionSelector(
        challengeStatues[challengeENUM.VERIFY_SOURCE],
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
      assert.entityCount('verifyChallengeSource', 1);

      assert.fieldEquals(
        'verifyChallengeSource',
        ChallengeId,
        'challenger',
        Challenger,
      );
    });
  });

  describe('test MDC verifyDest related function', () => {
    const ChallengeId: string = '0x123456';
    const Challenger: string = '0xc3c7a782dda00a8e61cb9ba0ea8680bb3f3b9d10';
    beforeAll(() => {
      const mockChallengeInput = mockChallengeFunctionSelector(
        challengeStatues[challengeENUM.VERIFY_DEST],
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
      assert.entityCount('verifyChallengeSource', 1);
      assert.entityCount('verifyChallengeDest', 1);

      assert.fieldEquals(
        'verifyChallengeDest',
        ChallengeId,
        'challenger',
        Challenger,
      );
    });
  });

  describe('test MDC challenge Liquidation related function', () => {
    const ChallengeId: string = '0x123456';
    const Challenger: string = '0xa16081f360e3847006db660bae1c6d1b2e17ec2a';
    const CreateChallengeID: string =
      '0xdb7a2a51019d786377e1fceeb3c2e1caf928f436a330eb2585e6fd2057100387';
    const mdcAddr: string = '0xa16081f360e3847006db660bae1c6d1b2e17ec2a';
    const checkChallenge_mockChallenger: string =
      '0xafcfbb382b28dae47b76224f24ee29be2c823648';
    beforeAll(() => {
      const mockChallengeInput = mockChallengeFunctionSelector(
        challengeStatues[challengeENUM.LIQUIDATION],
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

      // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
      // assert.fieldEquals(
      //   'liquidation',
      //   checkChallenge_mockChallenger,
      //   'id',
      //   checkChallenge_mockChallenger,
      // );

      // assert.fieldEquals(
      //   'liquidation',
      //   checkChallenge_mockChallenger,
      //   'challengeId',
      //   ChallengeId,
      // );

      assert.fieldEquals(
        'createChallenge',
        CreateChallengeID,
        'liquidator',
        Challenger,
      );

      // assert.fieldEquals(
      //   'challengeManager',
      //   ChallengeId,
      //   'liquidation',
      //   `[${checkChallenge_mockChallenger}\]`,
      // );
    });
  });
});
