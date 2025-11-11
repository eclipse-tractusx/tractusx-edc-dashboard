/*
 *  Copyright (c) 2025 Fraunhofer-Gesellschaft zur Förderung der angewandten Forschung e.V.
 *
 *  See the NOTICE file(s) distributed with this work for additional
 *  information regarding copyright ownership.
 *
 *  This program and the accompanying materials are made available under the
 *  terms of the Apache License, Version 2.0 which is available at
 *  https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *  License for the specific language governing permissions and limitations
 *  under the License.
 *
 *  SPDX-License-Identifier: Apache-2.0
 */

import {
  Action,
  AtomicConstraint,
  camelCaseToWords,
  Constraint,
  Permission,
  PolicyConfiguration,
  RightOperand,
} from '../models/policy';

export class RightOperands {
  static DataProvisioningEndDurationDays(): RightOperand {
    return {
      name: 'DataProvisioningEndDurationDays',
      operandType: 'integer',
      legalText: {
        obligation:
          'The Data Provider shall make the Data available for the period specified herein in days, commencing from the second the Agreement is concluded via the Registered Connector (RC).',
      },
      value: '30',
    };
  }

  static DataProvisioningEndDate(): RightOperand {
    return {
      name: 'DataProvisioningEndDate',
      operandType: 'string',
      pattern: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/,
      legalText: {
        obligation:
          'The Data Provider shall make the Data available for a limited period until the end date specified herein, commencing from the second the Agreement is concluded via the Registered Connector (RC).',
      },
      value: '2024-12-31T23:59:59Z',
    };
  }

  static DataExchangeGovernance(): RightOperand {
    return {
      name: 'DataExchangeGovernance',
      const: 'DataExchangeGovernance:1.0',
      operandType: 'string',
      legalText: {
        permission:
          'Data Provider and Data Consumer agree to the Data Exchange Governance published by the Catena-X Automotive Network e.V. (Association) as basis for this Agreement concluded via the Registered Connector (RC). The Data Exchange Governance Version 1.0 can be found here: <a href="https://catenax-ev.github.io/docs/regulatory-framework/20000ft/data-exchange-governance">https://catenax-ev.github.io/docs/regulatory-framework/20000ft/data-exchange-governance</a> after CX-Saturn has been released. The subject matter of the Agreement concluded via the RC is the provision of the Data for a limited period of one (1) year (unless otherwise agreed in <a href="https://w3id.org/catenax/2025/9/policy/data-provisioning-end-date-constraint-schema.json">dataProvisioningEndDate</a> or <a href="https://w3id.org/catenax/2025/9/policy/data-provisioning-end-duration-days-constraint-schema.json">dataProvisioningEndDurationDays</a>) and granting a right to use the Data for a period of one (1) year (unless agreed otherwise in <a href="https://w3id.org/catenax/2025/9/policy/data-usage-end-date-constraint-schema.json">dataUsageEndDate</a> or <a href="https://w3id.org/catenax/2025/9/policy/data-usage-end-duration-days-constraint-schema.json">dataUsageEndDurationDays</a> or open-ended <a href="https://w3id.org/catenax/2025/9/policy/data-usage-end-definition-constraint-schema.json">DataUsageEndUnlimited</a>). The provision of the Data shall be effected via the API specified by the dataset attribute dct:type. The Agreement concluded via the RC covers only the exchange of Data effected on the basis of the API version (as specified in the dataset attribute base-URL), the Asset-Version (dataset attribute cx-common:version), and the Aspect Model Version as applicable at the time of concluding the Agreement. Unless agreed otherwise in <a href="https://w3id.org/catenax/2025/9/policy/version-changes-constraint-schema.json">VersionChanges</a>, the Agreement concluded via the RC must be renegotiated in the event of any change to at least one of these versions. Unless otherwise agreed between the Parties within the Agreement concluded via the RC (in accordance with <a href="https://w3id.org/catenax/2025/9/policy/usage-purpose-constraint-schema.json">UsagePurpose</a>), the Data Provider grants the Data Consumer a non-exclusive right, limited in time to the duration of this contract (in accordance with <a href="https://w3id.org/catenax/2025/9/policy/data-usage-end-date-constraint-schema.json">dataUsageEndDate</a> or <a href="https://w3id.org/catenax/2025/9/policy/data-usage-end-duration-days-constraint-schema.json">dataUsageEndDurationDays</a> or open-ended <a href="https://w3id.org/catenax/2025/9/policy/data-usage-end-definition-constraint-schema.json">DataUsageEndUnlimited</a>), to use the Data in accordance with the Contractual Usage Purposes (in accordance with <a href="https://w3id.org/catenax/2025/9/policy/usage-purpose-constraint-schema.json">Usage Purpose</a>).',
      },
      value: 'DataExchangeGovernance:1.0',
    };
  }

  static MembershipActive(): RightOperand {
    return {
      name: 'MembershipActive',
      operandType: 'string',
      const: 'active',
    };
  }

  static BusinessPartnerNumber(): RightOperand {
    return {
      name: 'BusinessPartnerNumber',
      operandType: 'string',
      pattern: /^BPNL[0-9A-Z]{12}$/,
      value: 'BPNL0000000001',
    };
  }

  static BusinessPartnerGroup(): RightOperand {
    return {
      name: 'BusinessPartnerGroup',
      operandType: 'string',
      value: 'GROUP_A',
    };
  }

  static CoreLegalRequirementForThirdParty(): RightOperand {
    return {
      name: 'CoreLegalRequirementForThirdParty',
      const: 'cx.core.legalRequirementForThirdparty:1',
      operandType: 'string',
      legalText: {
        permission:
          'The Data Consumer may use the Data in line with the following purpose: facilitating compliance with mandatory regulatory requirements for tracking and reporting battery cells, modules & high-voltage batteries.',
        additionalInformation: 'Typically used for: Traction Battery Code',
      },
      value: 'cx.core.legalRequirementForThirdparty:1',
    };
  }

  static CoreIndustrycore(): RightOperand {
    return {
      name: 'CoreIndustrycore',
      const: 'cx.core.industrycore:1',
      operandType: 'string',
      legalText: {
        permission:
          'The Data Consumer may use the Data in line with the following purpose: Establishing a digital representation of the automotive supply chain to enable a component specific data exchange.',
        additionalInformation:
          'Typically used for: SerialPart, Batch, JustInSequencePart,SingleLevelBomAsBuilt, PartAsPlanned, SingleLevelBomAsPlanned, PartSiteInformationAsPlanned, UniqueIDPushAPI',
      },
      value: 'cx.core.industrycore:1',
    };
  }

  static CoreQualityNotifications(): RightOperand {
    return {
      name: 'CoreQualityNotifications',
      const: 'cx.core.qualityNotifications:1',
      operandType: 'string',
      legalText: {
        permission:
          'The Data Consumer may use the Data in line with the following purposes: quality analyses to identify and select affected components and to send quality notifications to affected customers or suppliers.',
        additionalInformation: 'Typically used for: Notification API',
      },
      value: 'cx.core.qualityNotifications:1',
    };
  }

  static CoreDigitalTwinRegistry(): RightOperand {
    return {
      name: 'CoreDigitalTwinRegistry',
      const: 'cx.core.digitalTwinRegistry:1',
      operandType: 'string',
      legalText: {
        permission:
          'The Data Consumer may use the Data in line with the following purposes: Identifying data offers of submodels within the Catena-X ecosystem.',
        additionalInformation: 'Typically used for: Digital Twin Registry Asset',
      },
    };
  }

  static PfcBase(): RightOperand {
    return {
      name: 'PfcBase',
      const: 'cx.pcf.base:1',
      operandType: 'string',
      legalText: {
        permission:
          "The Data Consumer may use the Data in line with the following purposes: (i) sending and receiving product-specific CO2 data and related functionalities such as (but not limited to) certificate exchange and notifications, (ii) conducting plausibility checks and validation measures, (iii) calculating aggregated PCFs of Data Consumer (including calculations operated by a technical service provider that (a) is certified for Catena-X, (b) is not authorized to evaluate data beyond such calculation and (c) provides calculations exclusively for Data Consumer's own purposes.",
        additionalInformation: 'Typically used for: PCF Model, PCF Exchange API',
      },
      value: 'cx.pcf.base:1',
    };
  }

  static QualityBase(): RightOperand {
    return {
      name: 'QualityBase',
      const: 'cx.quality.base:1',
      operandType: 'string',
      legalText: {
        permission:
          'The Data Consumer may use the Data  in line with the following purposes: (i) early identification of anomalies in the use of the product, (ii) collaborative root-cause analysis of a problem / error and determining corrective action, (iii) component tracing to optimize technical actions (in combination with use case Traceability), (iv) confirming corrective action, (v) preventive field observation to detect anomalies, (vi) processing notifications of quality alerts (supply chain bottom-up) and quality investigations (supply chain top-down) (possibly in combination with the use case Traceability).',
        additionalInformation:
          'Typically used for: Fleet Vehicles, Quality Task, QualityTaskAttachment, PartsAnalysis, ManufacturedPartsQInformation, FleetDiagnosticData, FleetClaim',
      },
      value: 'cx.quality.base:1',
    };
  }

  static DcmBase(): RightOperand {
    return {
      name: 'DcmBase',
      const: 'cx.dcm.base:1',
      operandType: 'string',
      legalText: {
        permission:
          'The Data Consumer may use the Data in line with the following purposes: (i) sending and receiving product-specific demand and capacity data, as well as the associated product functionalities, (ii) early identification of imbalances resulting from demand and capacity comparison, (iii) sending and receiving messages and notifications related to imbalances and to exchanged demand and capacity data, (iv) initiate a collaborative approach to solve imbalances.',
        additionalInformation:
          'Typically used for: Material Demand, WeekBasedCapacityGroup, IdBasedRequestForUpdate, IdBasedComment',
      },
      value: 'cx.dcm.base:1',
    };
  }

  static PurisBase(): RightOperand {
    return {
      name: 'PurisBase',
      const: 'cx.puris.base:1',
      operandType: 'string',
      legalText: {
        permission:
          'The Data Consumer may use the Data in line with the following purposes: optimizing processes, which includes, without limitation, regular exchange of data to prevent and/or solve shortages in the supply chain, conducting plausibility checks against other sources and/or collecting information to facilitate sound decision making, all of the above in the context of predictive unit real-time information relating to production and/or logistics.',
        additionalInformation:
          'Typically used for: Item Stock, Short-Term Material Demand, Planned Production Output, Delivery Information',
      },
      value: 'cx.puris.base:1',
    };
  }

  static CircularDpp(): RightOperand {
    return {
      name: 'CircularDpp',
      const: 'cx.circular.dpp:1',
      operandType: 'string',
      legalText: {
        permission:
          'The Data Consumer may use the Data in accordance to those applicable public legal regulation directly requiring digital product passports or affecting the contents or handling of digital product passports.',
        additionalInformation: 'Typically used for: Digital Product Pass, Battery Pass',
      },
      value: 'cx.circular.dpp:1',
    };
  }

  static CircularSmc(): RightOperand {
    return {
      name: 'CircularSmc',
      const: 'cx.circular.smc:1',
      operandType: 'string',
      legalText: {
        permission:
          'The Data Consumer may use the Data about secondary material content (SMC) in line with the following purpose: optimize the SMC-usage.',
        additionalInformation: 'Typically used for: SMC-Calculated, SMC-Verifiable',
      },
      value: 'cx.circular.smc:1',
    };
  }

  static CircularMarketplace(): RightOperand {
    return {
      name: 'CircularMarketplace',
      const: 'cx.circular.marketplace:1',
      operandType: 'string',
      legalText: {
        permission:
          'The Data Consumer may use the Data in line with the following purposes: buy, sell and/or procure parts and materials.',
        additionalInformation: 'Typically used for: Market Place Offer',
      },
      value: 'cx.circular.marketplace:1',
    };
  }

  static CircularMaterialaccounting(): RightOperand {
    return {
      name: 'CircularMaterialaccounting',
      const: 'cx.circular.materialaccounting:1',
      operandType: 'string',
      legalText: {
        permission:
          'The Data Consumer may use the Data in line with the following purposes: (i) display, process, analysis, correlate, modify and amend data, (ii) for (e.g. enablement of) chain of custody processes and commercial transaction related thereto and allocation of material to parts to the supply chain.',
      },
      value: 'cx.circular.materialaccounting:1',
    };
  }

  static BpdmGateUpload(): RightOperand {
    return {
      name: 'BpdmGateUpload',
      const: 'cx.bpdm.gate.upload:1',
      operandType: 'string',
      legalText: {
        permission:
          'The Data Consumer may use the Data in line with the following purposes: verifying, curating and enriching the Data to create a record of basic information about all entities with a BPN in the Catena-X data space accessible to all participants (Golden Record) and for early warning services (Value Added Services, VASs).',
        additionalInformation: 'Typically used for: Gate Data Model',
      },
      value: 'cx.bpdm.gate.upload:1',
    };
  }

  static BpdmGateDownload(): RightOperand {
    return {
      name: 'BpdmGateDownload',
      const: 'cx.bpdm.gate.download:1',
      operandType: 'string',
      legalText: {
        permission:
          'The Data Consumer may use the basic information about entities with a BPN in the Catena-X data space provided by the Core Service B Provider in line with the following purposes: (i) identifying counterparty, (ii) usage in Value Added Services (VASs).',
        additionalInformation: 'Typically used for: Gate Data Model',
      },
      value: 'cx.bpdm.gate.download:1',
    };
  }

  static BpdmPool(): RightOperand {
    return {
      name: 'BpdmPool',
      const: 'cx.bpdm.pool:1',
      operandType: 'string',
      legalText: {
        permission:
          'The Data Consumer may use the Data in line with the following purposes: (i) identifying participants within the Catena-X data space, (ii) identifying counterparty (iii), usage in  information processes, (iv) invitation of additional participants into the Catena-X data space, (v) usage in Value Added Services (VASs), ',
        additionalInformation: 'Typically used for: Pool Data Models',
      },
      value: 'cx.bpdm.pool:1',
    };
  }

  static BpdmVasCountryrisk(): RightOperand {
    return {
      name: 'BpdmVasCountryrisk',
      const: 'cx.bpdm.vas.countryrisk:1',
      operandType: 'string',
      legalText: {
        permission:
          "The Data Consumer may use the Data in line with the following purpose: screening participant's business data to identify risks when collaborating with a new/existing business partner according to official or company-specific country risk assessments.",
        additionalInformation: 'Typically used for: Country Risk Data Model, Gate Data Model, Pool Data Models',
      },
    };
  }

  static BpdmVasDataqualityUpload(): RightOperand {
    return {
      name: 'BpdmVasDataqualityUpload',
      const: 'cx.bpdm.vas.dataquality.upload:1',
      operandType: 'string',
      legalText: {
        permission:
          "The Data Consumer may use the Data in line with the following purposes: (i) assessing Data Provider's data quality, (ii) creating benchmarks for future screenings of other participants' data to fulfill the goals of the Data Quality Dashboard application.",
        additionalInformation: 'Typically used for: Business Partner Data Model',
      },
      value: 'cx.bpdm.vas.dataquality.upload:1',
    };
  }

  static BpdmVasDataqualityDownload(): RightOperand {
    return {
      name: 'BpdmVasDataqualityDownload',
      const: 'cx.bpdm.vas.dataquality.download:1',
      operandType: 'string',
      legalText: {
        permission:
          'The Data Consumer may use the Data in line with the following purpose: Assessing quality of own data.',
        additionalInformation: 'Typically used for: Data Quality Dashboard Data Model',
      },
      value: 'cx.bpdm.vas.dataquality.download:1',
    };
  }

  static BpdmVasBdvUpload(): RightOperand {
    return {
      name: 'BpdmVasBdvUpload',
      const: 'cx.bpdm.vas.bdv.upload:1',
      operandType: 'string',
      legalText: {
        permission:
          "The Data Consumer may use the Data in line with the following purpose: screening relevant Data Provider's submitted bank data to verify Data Provider's bank data.",
        additionalInformation: 'Typically used for: Gate Data Model, Bank Data Verification Data Model',
      },
      value: 'cx.bpdm.vas.bdv.upload:1',
    };
  }

  static BpdmVasFpdUpload(): RightOperand {
    return {
      name: 'BpdmVasFpdUpload',
      const: 'cx.bpdm.vas.fpd.upload:1',
      operandType: 'string',
      legalText: {
        permission:
          "The Data Consumer may use the Data in line with the following purpose: screening Data Provider's submitted business partner data to assess occurrence of fraud.",
        additionalInformation: 'Typically used for: Fraud Prevention Data Model',
      },
      value: 'cx.bpdm.vas.fpd.upload:1',
    };
  }

  static BpdmVasFpdDownload(): RightOperand {
    return {
      name: 'BpdmVasFpdDownload',
      const: 'cx.bpdm.vas.fpd.download:1',
      operandType: 'string',
      legalText: {
        permission:
          'The Data Consumer may use the Data in line with the following purpose: Assessing fraud risks in transactions with another participant.',
        additionalInformation: 'Typically used for: Fraud Prevention Data Model',
      },
      value: 'cx.bpdm.vas.fpd.download:1',
    };
  }

  static BpdmVasSwdUpload(): RightOperand {
    return {
      name: 'BpdmVasSwdUpload',
      const: 'cx.bpdm.vas.swd.upload:1',
      operandType: 'string',
      legalText: {
        permission:
          "The Data Consumer may use the Data in line with the following purpose: screening Data Provider's submitted beneficial ownership data to assess trade compliance.",
        additionalInformation: 'Typically used for: Gate Data Model',
      },
      value: 'cx.bpdm.vas.swd.upload:1',
    };
  }

  static BpdmVasSwdDownload(): RightOperand {
    return {
      name: 'BpdmVasSwdDownload',
      const: 'cx.bpdm.vas.swd.download:1',
      operandType: 'string',
      legalText: {
        permission:
          'The Data Consumer may use the Data in line with the following purpose: assessing trade sanction risks in transactions with another participant.',
        additionalInformation: 'Typically used for: Sanction Party Watch List Dashboard Data Model',
      },
      value: 'cx.bpdm.vas.swd.download:1',
    };
  }

  static BpdmVasNpsUpload(): RightOperand {
    return {
      name: 'BpdmVasNpsUpload',
      const: 'cx.bpdm.vas.nps.upload:1',
      operandType: 'string',
      legalText: {
        permission:
          "The Data Consumer may use the Data in line with the following purposes: verifying Data Provider's submitted Business Partner Data against Natural Person data entries.",
        additionalInformation: 'Typically used for: Gate Data Model',
      },
      value: 'cx.bpdm.vas.nps.upload:1',
    };
  }

  static BpdmVasNpsDownload(): RightOperand {
    return {
      name: 'BpdmVasNpsDownload',
      const: 'cx.bpdm.vas.nps.download:1',
      operandType: 'string',
      legalText: {
        permission:
          'The Data Consumer may use the Data in line with the following purpose: verifying its submitted Business Partner Data.',
        additionalInformation: 'Typically used for: Natural Person Screening Data Model',
      },
      value: 'cx.bpdm.vas.nps.download:1',
    };
  }

  static CcmBase(): RightOperand {
    return {
      name: 'CcmBase',
      const: 'cx.ccm.base:1',
      operandType: 'string',
      legalText: {
        permission:
          'The Data Consumer may use the exchanged business partner certificates in line with the following purpose: Verification and validation of the existence of a certification.',
        additionalInformation: 'Typically used for: Business Partner Certificate',
      },
      value: 'cx.ccm.base:1',
    };
  }

  static BpdmPoolAll(): RightOperand {
    return {
      name: 'BpdmPoolAll',
      const: 'cx.bpdm.poolAll:1',
      operandType: 'string',
      legalText: {
        permission:
          'The Data Consumer may use the basic information about all entities with a BPN in the Catena-X data space provided by the Core Service B Provider in line with the following purposes: (i) identifying internal counterparties, (ii) usage in internal information processes, (iii) usage in Value Added Services (VAS).',
        additionalInformation: 'Typically used for: Pool Data Model',
      },
      value: 'cx.bpdm.poolAll:1',
    };
  }

  static LogisticsBase(): RightOperand {
    return {
      name: 'LogisticsBase',
      const: 'cx.logistics.base:1',
      operandType: 'string',
      legalText: {
        permission:
          'The Data Consumer may use the logistic Data in line with the following purposes: (i) tracking of load carriers, reusable boxes and any packaging, (ii) early identification of delay or damages on transport, and (iii) identification of affected part instances or batch instances on respective transport units.',
        additionalInformation:
          'Typically used for: asset_tracker_links, batch, global_transport_label, sensor_data, packing_list, serial_part',
      },
      value: 'cx.logistics.base:1',
    };
  }

  static UsagePurposeIndividual(): RightOperand {
    return {
      name: 'UsagePurposeIndividual',
      operandType: 'string',
      legalText: {
        permission:
          'Data Provider and Data Consumer are free to individually agree this certain purpose of use. The legal meaning of this certain purpose need to be agreed individually between Data Provider and Data Consumer.',
      },
      value: 'INDIVIDUAL',
    };
  }

  static ContractReference(): RightOperand {
    return {
      name: 'ContractReference',
      operandType: 'string',
      legalText: {
        permission:
          'Data Provider and Data Consumer are free to reference an existing, individual contract as a basis of the Agreement concluded via the Registered Connector (RC). This can be a framework agreement or a very specific contract. The rightOperand value for this constraint can be a free to choose reference under which both parties are able to identify their contract. The reference does not have to have a version number.',
      },
      value: 'CONTRACT-REF-123',
    };
  }

  static RegionAll(): RightOperand {
    return {
      name: 'RegionAll',
      const: 'cx.region.all:1',
      operandType: 'string',
      legalText: {
        permission:
          "The Data Provider permits the Data Consumer to make the Data available for use by its affiliated companies within the meaning of Section 15 German Stock Corporation Act ('Affiliated Companies') ('Sublicensing'), provided that the Data Consumer ensures that its Affiliated Companies comply with the terms of this Agreement concluded via the Registered Connector (RC).",
        prohibition:
          "The Data Consumer is not entitled to make the Data available for use to its affiliated companies within the meaning of Section 15 German Stock Corporation Act ('Affiliated Companies'), unless the Parties have otherwise agreed on a right of sublicensing in the referenced contract (cx-policy:ContractReference).",
      },
      value: 'cx.region.all:1',
    };
  }

  static RegionEurope(): RightOperand {
    return {
      name: 'RegionEurope',
      const: 'cx.region.europe:1',
      operandType: 'string',
      legalText: {
        permission:
          "The Data Provider permits the Data Consumer to make the Data available for use by its affiliated companies within the meaning of Section 15 German Stock Corporation Act ('Affiliated Companies') ('Sublicensing'), provided that the Data Consumer ensures that its Affiliated Companies comply with the terms of this Agreement concluded via the Registered Connector (RC). The registered offices of the relevant Affiliated Companies must be located in Europe.",
        prohibition:
          "The Data Consumer is not entitled to make the Data available for use by its affiliated companies within the meaning of Section 15 German Stock Corporation Act ('Affiliated Companies') that are domiciled in Europe, unless the Parties have otherwise agreed on a right of sublicensing (either in full or with respect to individual Affiliated Companies) in the referenced bilateral contract ('cx-policy:ContractReference') or have agreed to this separately.",
      },
      value: 'cx.region.europe:1',
    };
  }

  static RegionNorthAmerica(): RightOperand {
    return {
      name: 'RegionNorthAmerica',
      const: 'cx.region.northAmerica:1',
      operandType: 'string',
      legalText: {
        permission:
          "The Data Provider permits the Data Consumer to make the Data available for use by its affiliated companies within the meaning of Section 15 German Stock Corporation Act ('Affiliated Companies') ('Sublicensing'), provided that the Data Consumer ensures that its Affiliated Companies comply with the terms of this Agreement concluded via the Registered Connector (RC). The registered offices of the relevant Affiliated Companies must be located in North America.",
        prohibition:
          "The Data Consumer is not entitled to make the Data available for use by its affiliated companies within the meaning of Section 15 German Stock Corporation Act ('Affiliated Companies') that are domiciled in North America, unless the Parties have otherwise agreed on a right of sublicensing (either in full or with respect to individual Affiliated Companies) in the referenced bilateral contract ('cx-policy:ContractReference') or have agreed to this separately.",
      },
      value: 'cx.region.northAmerica:1',
    };
  }

  static RegionSouthAmerica(): RightOperand {
    return {
      name: 'RegionSouthAmerica',
      const: 'cx.region.southAmerica:1',
      operandType: 'string',
      legalText: {
        permission:
          "The Data Provider permits the Data Consumer to make the Data available for use by its affiliated companies within the meaning of Section 15 German Stock Corporation Act ('Affiliated Companies') ('Sublicensing'), provided that the Data Consumer ensures that its Affiliated Companies comply with the terms of this Agreement concluded via the Registered Connector (RC). The registered offices of the relevant Affiliated Companies must be located in South America.",
        prohibition:
          "The Data Consumer is not entitled to make the Data available for use by its affiliated companies within the meaning of Section 15 German Stock Corporation Act ('Affiliated Companies') that are domiciled in South America, unless the Parties have otherwise agreed on a right of sublicensing (either in full or with respect to individual Affiliated Companies) in the referenced bilateral contract ('cx-policy:ContractReference') or have agreed to this separately.",
      },
      value: 'cx.region.southAmerica:1',
    };
  }

  static RegionAfrica(): RightOperand {
    return {
      name: 'RegionAfrica',
      const: 'cx.region.africa:1',
      operandType: 'string',
      legalText: {
        permission:
          "The Data Provider permits the Data Consumer to make the Data available for use by its affiliated companies within the meaning of Section 15 German Stock Corporation Act ('Affiliated Companies') ('Sublicensing'), provided that the Data Consumer ensures that its Affiliated Companies comply with the terms of this Agreement concluded via the Registered Connector (RC). The registered offices of the relevant Affiliated Companies must be located in Africa.",
        prohibition:
          "The Data Consumer is not entitled to make the Data available for use by its affiliated companies within the meaning of Section 15 German Stock Corporation Act ('Affiliated Companies') that are domiciled in Africa, unless the Parties have otherwise agreed on a right of sublicensing (either in full or with respect to individual Affiliated Companies) in the referenced bilateral contract ('cx-policy:ContractReference') or have agreed to this separately.",
      },
      value: 'cx.region.africa:1',
    };
  }

  static RegionAsia(): RightOperand {
    return {
      name: 'RegionAsia',
      const: 'cx.region.asia:1',
      operandType: 'string',
      legalText: {
        permission:
          "The Data Provider permits the Data Consumer to make the Data available for use by its affiliated companies within the meaning of Section 15 German Stock Corporation Act ('Affiliated Companies') ('Sublicensing'), provided that the Data Consumer ensures that its Affiliated Companies comply with the terms of this Agreement concluded via the Registered Connector (RC). The registered offices of the relevant Affiliated Companies must be located in Asia.",
        prohibition:
          "The Data Consumer is not entitled to make the Data available for use by its affiliated companies within the meaning of Section 15 German Stock Corporation Act ('Affiliated Companies') that are domiciled in Asia, unless the Parties have otherwise agreed on a right of sublicensing (either in full or with respect to individual Affiliated Companies) in the referenced bilateral contract ('cx-policy:ContractReference') or have agreed to this separately.",
      },
      value: 'cx.region.asia:1',
    };
  }

  static RegionOceania(): RightOperand {
    return {
      name: 'RegionOceania',
      const: 'cx.region.oceania:1',
      operandType: 'string',
      legalText: {
        permission:
          "The Data Provider permits the Data Consumer to make the Data available for use by its affiliated companies within the meaning of Section 15 German Stock Corporation Act ('Affiliated Companies') ('Sublicensing'), provided that the Data Consumer ensures that its Affiliated Companies comply with the terms of this Agreement concluded via the Registered Connector (RC). The registered offices of the relevant Affiliated Companies must be located in Oceania.",
        prohibition:
          "The Data Consumer is not entitled to make the Data available for use by its affiliated companies within the meaning of Section 15 German Stock Corporation Act ('Affiliated Companies') that are domiciled in Oceania, unless the Parties have otherwise agreed on a right of sublicensing (either in full or with respect to individual Affiliated Companies) in the referenced bilateral contract ('cx-policy:ContractReference') or have agreed to this separately.",
      },
      value: 'cx.region.oceania:1',
    };
  }

  static RegionAntarctica(): RightOperand {
    return {
      name: 'RegionAntarctica',
      const: 'cx.region.antarctica:1',
      operandType: 'string',
      legalText: {
        permission:
          "The Data Provider permits the Data Consumer to make the Data available for use by its affiliated companies within the meaning of Section 15 German Stock Corporation Act ('Affiliated Companies') ('Sublicensing'), provided that the Data Consumer ensures that its Affiliated Companies comply with the terms of this Agreement concluded via the Registered Connector (RC). The registered offices of the relevant Affiliated Companies must be located in Antarctica.",
        prohibition:
          "The Data Consumer is not entitled to make the Data available for use by its affiliated companies within the meaning of Section 15 German Stock Corporation Act ('Affiliated Companies') that are domiciled in Antarctica, unless the Parties have otherwise agreed on a right of sublicensing (either in full or with respect to individual Affiliated Companies) in the referenced bilateral contract ('cx-policy:ContractReference') or have agreed to this separately.",
      },
      value: 'cx.region.antarctica:1',
    };
  }

  static AffiliatesBpnl(): RightOperand {
    return {
      name: 'AffiliatesBpnl',
      operandType: 'string',
      pattern: /^BPNL[0-9A-Z]{12}$/,
      legalText: {
        permission:
          "The Data Provider permits the Data Consumer to make the Data available for use by the Affiliated companies within the meaning of Section 15 German Stock Corporation Act ('Affiliated Companies') ('Sublicensing') specified herein, provided that the Data Consumer ensures that such companies and/or its its Affiliated Companies comply with the terms of the Agreement concluded via the Registered Connector (RC).",
        prohibition:
          "The Data Consumer is not entitled to make the Data available for use by the companies specified herein ('Sublicensing'), unless the Parties have otherwise agreed on a right to sublicense the Data (either in full or with respect to individual affiliated companies) in the referenced  contract ('cx-policy:ContractReference') or have agreed to this separately.",
      },
      value: 'BPNL0000000003',
    };
  }

  static DataFrequencyOnce(): RightOperand {
    return {
      name: 'DataFrequencyOnce',
      const: 'cx.dataFrequency.once:1',
      operandType: 'string',
      legalText: {
        permission:
          'This Agreement concluded via the Registered Connector (RC). applies both to a one-time, time-limited data exchange as well as to sequential data exchanges under similar conditions, potentially also in varying quantities (Data as a Service).',
      },
      value: 'cx.dataFrequency.once:1',
    };
  }

  static DataFrequencyUnlimited(): RightOperand {
    return {
      name: 'DataFrequencyUnlimited',
      const: 'cx.dataFrequency.unlimited:1',
      operandType: 'string',
      legalText: {
        permission:
          'This Agreement concluded via the Registered Connector (RC). applies to the multiple or repeated exchange of similar Data at different times and in different quantities within the scope of the selected Use Case.',
      },
      value: 'cx.dataFrequency.unlimited:1',
    };
  }

  static VersionChangesMinor(): RightOperand {
    return {
      name: 'VersionChangesMinor',
      const: 'cx.versionChanges.minor:1',
      operandType: 'string',
      legalText: {
        permission:
          'The Agreement concluded via the Registered Connector (RC) covers only the exchange of Data effected on the basis of the major API version (as specified in the dataset attribute base-URL), the major Asset-Version (dataset attribute cx-common:version), and/or the major Aspect Model Version as applicable at the time of concluding the Agreement. The Agreement concluded via the RC must be renegotiated in the event of any change to at least one of these major versions. The Agreement does not need to be renegotiated in the event of any change to one of these minor versions. The definitions of major and minor version is based on Semantic Versioning (https://semver.org/).',
      },
      value: 'cx.versionChanges.minor:1',
    };
  }

  static VersionChangesMajor(): RightOperand {
    return {
      name: 'VersionChangesMajor',
      const: 'cx.versionChanges.major:1',
      operandType: 'string',
      legalText: {
        permission:
          'The Agreement concluded via the Registered Connector (RC) covers any data exchange, which shall be effected via the API specified by the dataset attribute dct:type, irrespective of whether the API version applicable at the time of contract conclusion (as part of the dataset attribute base-URL), the Asset Version (dataset attribute cx-common:version), or the Aspect Model version changes.',
      },
      value: 'cx.versionChanges.major:1',
    };
  }

  static DataDeletion(): RightOperand {
    return {
      name: 'DataDeletion',
      const: 'cx.data.deletion:1',
      operandType: 'string',
      legalText: {
        permission:
          "Upon expiry of the period of use (in accordance with cx-policy:DataUsageEnd) as well as in the event of termination, the Data Consumer shall be obliged to delete the Data (including all copies in backup systems that can be deleted with reasonable effort) from all systems and storage media and, upon request, confirm this to the Data Provider in text form. The foregoing obligation shall apply accordingly to the extent that the Data Consumer is permitted to provide the data to Affiliated Companies (in accordance with cx-policy:affiliates.*) or to companies for which the Data Consumer acts in an 'is managed by' relationship (within the meaning of the Catena-X Standard CX-0076) (in accordance with cx-policy:contractingCompany.*). The Data Consumer is entitled to make and retain a copy of the Data for as long as necessary to safeguard legitimate interests vis-à-vis the Data Provider - particularly for the purpose of demonstrating breaches of contractual obligations arising from the provision of the Data.",
      },
      value: 'cx.data.deletion:1',
    };
  }

  static DataKeeping(): RightOperand {
    return {
      name: 'DataKeeping',
      const: 'cx.data.keeping:1',
      operandType: 'string',
      legalText: {
        permission:
          "Upon expiry of the period of use (in accordance with cx-policy:dataUsageEnd) as well as in the event of termination, the Data Consumer shall not be obliged to delete the Data (including all copies in backup systems that can be deleted with reasonable effort) from all systems and storage media. The foregoing shall apply accordingly to the extent that the Data Consumer is permitted to provide the Data to Affiliated Companies (in accordance with leftOperand cx-policy:affiliates.*) or to companies for which the Data Consumer acts in an 'is managed by' relationship (within the meaning of the Catena-X Standard CX-0076) (in accordance with cx-policy:contractingCompany.*). In such case, the Data Consumer shall be entitled to continue using the Data exclusively within the scope of the purpose limitation and other conditions of the contract. The Data Consumer shall take all necessary measures to protect the Data against unauthorised access by third parties.",
      },
      value: 'cx.data.keeping:1',
    };
  }

  static ConfidentialityMeasures(): RightOperand {
    return {
      name: 'ConfidentialityMeasures',
      const: 'cx.confidentiality.measures:1',
      operandType: 'string',
      legalText: {
        permission:
          'The Data Consumer is obliged to take all appropriate technical and organisational measures to protect the Confidential Information of the Data Provider, in order to prevent unauthorised disclosure to third parties. The Data Consumer is also obliged to inform the Data Provider without undue delay about any unauthorised disclosure of Confidential Information.',
      },
      value: 'cx.confidentiality.measures:1',
    };
  }

  static SharingAffiliates(): RightOperand {
    return {
      name: 'SharingAffiliates',
      const: 'cx.sharing.affiliates:1',
      operandType: 'string',
      legalText: {
        permission:
          "The Data Consumer may only disclose Confidential Information to Affiliated Companies if and to the extent that the Data Provider has expressly permitted such disclosure in accordance with the Data Exchange Governance or the cx-policy:affiliates.*. The Data Consumer may only disclose Confidential Information to Affiliated Companies to the extent that the Affiliated Companies and their employees are bound to Confidentiality Obligations at least equivalent to those set forth in this Agreement. Furthermore, access to and use of the relevant Data must be restricted to those employees of the Affiliated Company who require the Data in order to exercise the agreed usage rights ('need to know').",
      },
      value: 'cx.sharing.affiliates:1',
    };
  }

  static SharingManagedLegalEntity(): RightOperand {
    return {
      name: 'SharingManagedLegalEntity',
      const: 'cx.sharing.managedLegalEntity:1',
      operandType: 'string',
      legalText: {
        permission:
          "The Data Consumer may only disclose Confidential Information to those companies for which the Data Consumer acts in an 'is managed by' relationship (within the meaning of the Catena-X Standard 'CX-0074') if and to the extent those companies are expressly listed in cx-policy:managedLegalEntity.*. The Data Consumer may only disclose Confidential Information to those Companies to the extent that those Companies and their employees are bound to Confidentiality Obligations at least equivalent to those set forth in this Agreement. Furthermore, access to and use of the relevant Data must be restricted to those employees of the Company who require the Data in order to exercise the agreed usage rights ('need to know').",
      },
      value: 'cx.sharing.managedLegalEntity:1',
    };
  }

  static ExclusiveUsageDataConsumer(): RightOperand {
    return {
      name: 'ExclusiveUsageDataConsumer',
      const: 'cx.exclusiveUsage.dataConsumer:1',
      operandType: 'string',
      legalText: {
        permission:
          'The Data Consumer has the exclusive right to use the Data within the scope of the agreed purposes (cx-policy:UsagePurpose). The Data Provider’s right to use the Data it has provided for its own internal purposes remains unaffected.',
      },
      value: 'cx.exclusiveUsage.dataConsumer:1',
    };
  }

  static WarrantyNone(): RightOperand {
    return {
      name: 'WarrantyNone',
      const: 'cx.warranty.none:1',
      operandType: 'string',
      legalText: {
        permission:
          'The provision of the Data is made with the exclusion of any warranty for material defects and defects in title, unless the Data Provider fraudulently conceals such a defect.',
      },
      value: 'cx.warranty.none:1',
    };
  }

  static WarrantyContractReference(): RightOperand {
    return {
      name: 'WarrantyContractReference',
      const: 'cx.warranty.contractReference:1',
      operandType: 'string',
      legalText: {
        permission:
          'The provision of the Data is subject to the warranty for material defects and defects in title as agreed in the description of the subject matter of performance according to the referenced contract (leftOperand: ContractReference).',
      },
      value: 'cx.warranty.contractReference:1',
    };
  }

  static WarrantyDataQualityIssues(): RightOperand {
    return {
      name: 'WarrantyDataQualityIssues',
      const: 'cx.warranty.dataQualityIssues:1',
      operandType: 'string',
      legalText: {
        permission:
          'In the event of a material deviation from the contractually agreed data quality, the Data Provider shall be entitled to (i) demand the rectification of defects by provision of Data in the quality owed, (ii) terminate the contract in the event of failure to remedy the defect, and (iii) claim damages in accordance with the liability provisions set out below.',
      },
      value: 'cx.warranty.dataQualityIssues:1',
    };
  }

  static WarrantyDurationMonths(): RightOperand {
    return {
      name: 'WarrantyDurationMonths',
      operandType: 'integer',
      legalText: {
        permission:
          'The provision of the Data is subject to a warranty for material and legal defects for a period specified herein in months.',
      },
      value: '12',
    };
  }

  static WarrantyContractEndDate(): RightOperand {
    return {
      name: 'WarrantyContractEndDate',
      const: 'cx.warranty.contractEndDate:1',
      operandType: 'string',
      legalText: {
        permission:
          'The provision of the Data is subject to a warranty for material defects and defects in title until the end of the Agreement concluded via the Registered Connector (RC).',
      },
      value: 'cx.warranty.contractEndDate:1',
    };
  }

  static GrossNegligence(): RightOperand {
    return {
      name: 'GrossNegligence',
      const: 'cx.grossNegligence:1',
      operandType: 'string',
      legalText: {
        permission:
          "The Data Provider's liability is limited to intent and gross negligence. The same applies in regard to the Data Provider's liability for its legal representatives, employees and authorised representatives.",
      },
      value: 'cx.grossNegligence:1',
    };
  }

  static SlightNegligence(): RightOperand {
    return {
      name: 'SlightNegligence',
      const: 'cx.slightNegligence:1',
      operandType: 'string',
      legalText: {
        permission:
          'The liability of the Data Provider in cases of ordinary negligence shall be limited to x, as individually agreed by the Parties in the referenced bilateral agreement (cx-policy:ContractReference). The foregoing limitation of liability shall not apply in the event of mandatory statutory liability (in particular under the German Product Liability Act), nor in the event of the assumption of a guarantee or for any culpably caused bodily injury.',
      },
      value: 'cx.slightNegligence:1',
    };
  }

  static LocationString(): RightOperand {
    return {
      name: 'LocationString',
      operandType: 'string',
      legalText: {
        permission:
          'The exclusive venue for all disputes arising from the Agreement concluded via the Registered Connector (RC) shall be at the competent court at the location specified herein.',
      },
      value: 'Stuttgart',
    };
  }

  static LocationDataConsumer(): RightOperand {
    return {
      name: 'LocationDataConsumer',
      const: 'cx.location.dataConsumer:1',
      operandType: 'string',
      legalText: {
        permission:
          'The exclusive venue for all disputes arising from the contract concluded via the Registered Connector (RC) shall be at the competent court at the registered office of the Data Consumer.',
      },
      value: 'cx.location.dataConsumer:1',
    };
  }

  static LocationContractReference(): RightOperand {
    return {
      name: 'LocationContractReference',
      const: 'cx.location.contractReference:1',
      operandType: 'string',
      legalText: {
        permission:
          'The exclusive venue for all disputes arising from the Agreement concluded via the Registered Connector (RC) shall correspond to the venue specified in the referenced contract (as referenced in cx-policy:ContractReference).',
      },
      value: 'cx.location.contractReference:1',
    };
  }

  static PrecedenceContractReference(): RightOperand {
    return {
      name: 'PrecedenceContractReference',
      const: 'cx.precedence.contractReference:1',
      operandType: 'string',
      legalText: {
        permission:
          'The Parties are free to agree on additional provisions in a separately referenced contract, in addition to the arrangements made via the Registered Connector (RC) Process (referenced in leftOperand: contractReference). In the event of any conflict between the provisions agreed via the RC Process and those of the referenced contract, the provisions of the contract shall take precedence.',
      },
      value: 'cx.precedence.contractReference:1',
    };
  }

  static PrecedenceRcAgreement(): RightOperand {
    return {
      name: 'PrecedenceRcAgreement',
      const: 'cx.precedence.rcAgreement:1',
      operandType: 'string',
      legalText: {
        permission:
          'The Parties are free to agree on additional provisions in a referenced contract (as referenced in leftOperand: contractReference) in addition to the arrangements agreed via the Registered Connector (RC) Process. In such case, the provisions agreed via the RC Process shall take precedence over the provisions of the referenced contract.',
      },
      value: 'cx.precedence.rcAgreement:1',
    };
  }

  static DataUsageEndDurationDays(): RightOperand {
    return {
      name: 'DataUsageEndDurationDays',
      operandType: 'integer',
      legalText: {
        permission:
          'The Data Provider shall make the Data available for the usage period specified herein, measured in days, in accordance with the usage conditions set out in cx-policy:UsagePurpose, commencing from the moment of concluding the Agreement via the Registered Connector (RC). Upon expiry of the permitted usage period, the Data Consumer shall no longer be entitled to use the Data, and shall delete the Data from all systems and storage media in order to prevent any further use, unless the Data Consumer has received the same Data under another valid contract. The Agreement shall terminate automatically upon expiry of the usage period for the Data, without the need for a separate notice of termination.',
      },
      value: '60',
    };
  }

  static DataUsageEndDate(): RightOperand {
    return {
      name: 'DataUsageEndDate',
      operandType: 'string',
      pattern: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/,
      legalText: {
        permission:
          'The Data Provider shall make the Data available with a usage period permitted until the end date specified herein, in accordance with the usage conditions specified in cx-policy:UsagePurpose, commencing from the second the Agreement is concluded via the Registered Connector (RC). Upon expiry of the usage period, the Data Consumer shall no longer be entitled to use the Data and shall delete the Data in order to prevent any further Use, unless the Data Consumer has received the same Data under another still valid contract. The Agreement shall terminate upon expiry of the usage period of the Data without the need for a separate notice of termination.',
      },
      value: '2025-12-31T23:59:59Z',
    };
  }

  static DataUsageEndDefinition(): RightOperand {
    return {
      name: 'DataUsageEndDefinition',
      const: 'cx.dataUsageEnd.unlimited:1',
      operandType: 'string',
      legalText: {
        permission:
          'The Data Provider shall make the Data available for an unlimited period of use in accordance with the usage conditions specified in cx-policy:UsagePurpose, commencing from the second the Agreement is concluded via the Registered Connector (RC).',
      },
      value: 'cx.dataUsageEnd.unlimited:1',
    };
  }

  static ThirdPartyForbidden(): RightOperand {
    return {
      name: 'ThirdPartyForbidden',
      const: 'cx.thirdParty.forbidden:1',
      operandType: 'string',
      legalText: {
        prohibition:
          'The Data Consumer is prohibited from making the Data available to third parties, either temporarily or permanently, from reproducing, distributing, or publicly displaying the Data; this also applies insofar as the data constitutes essential or non-essential parts of a database (Section 87a German Act on Copyright and Related Rights (UrhG)), unless otherwise individually agreed between the Parties in the usage purposes for a specific use case (cx-policy:UsagePurpose) or in the referenced bilateral contract (cx-policy:ContractReference). The Data Provider’s right to reproduce the Data provided by it for internal purposes remains unaffected.',
      },
      value: 'cx.thirdParty.forbidden:1',
    };
  }

  static ManipulationForbidden(): RightOperand {
    return {
      name: 'ManipulationForbidden',
      const: 'cx.manipulation.forbidden:1',
      operandType: 'string',
      legalText: {
        prohibition:
          'The Data Consumer is prohibited from modifying the Data, separating the associated metadata from the Data, or otherwise altering it, or from attempting any of the aforementioned actions or permitting a third party to perform such actions, unless otherwise individually agreed between the parties in the usage purposes for a specific use case (cx-policy:UsagePurpose) or in the referenced bilateral contract (cx-policy:ContractReference). The Data Provider’s right to reproduce the Data provided by it for internal purposes remains unaffected.',
      },
      value: 'cx.manipulation.forbidden:1',
    };
  }

  static DerivationsForbidden(): RightOperand {
    return {
      name: 'DerivationsForbidden',
      const: 'cx.derivations.forbidden:1',
      operandType: 'string',
      legalText: {
        prohibition:
          'The Data Consumer is prohibited from creating derivative works from the Data (including making substantial changes to any databases provided within the meaning of Section 87a para. 1 sentence 2 German Act on Copyright and Related Rights (UrhG), unless otherwise individually agreed between the Parties in the usage purposes for a specific Use Case (cx-policy:UsagePurpose) or in the referenced bilateral contract (cx-policy:ContractReference).',
      },
      value: 'cx.derivations.forbidden:1',
    };
  }

  static ExtraordinaryAnalyticsForbidden(): RightOperand {
    return {
      name: 'ExtraordinaryAnalyticsForbidden',
      const: 'cx.extraordinaryAnalytics.forbidden:1',
      operandType: 'string',
      legalText: {
        prohibition:
          'The Data Consumer is prohibited, insofar as the Data constitutes insignificant parts of a database within the meaning of Section 87b para. 1 sentence 1 German Act on Copyright and Related Rights (UrhG), from repeatedly and systematically carrying out actions that conflict with the normal evaluation of a database or unreasonably impair the legitimate interests of the Data Provider (Section 87b para. 1 sentence 2 UrhG), unless otherwise individually agreed between the Parties in the usage purposes for a specific Use Case (cx-policy:UsagePurpose) or in the referenced bilateral contract (cx-policy:ContractReference).',
      },
      value: 'cx.extraordinaryAnalytics.forbidden:1',
    };
  }

  static DataProviderRemovalForbidden(): RightOperand {
    return {
      name: 'DataProviderRemovalForbidden',
      const: 'cx.dataProviderRemoval.forbidden:1',
      operandType: 'string',
      legalText: {
        prohibition:
          'The Data Consumer is prohibited from removing the company identifiers and/or other references to the Data Provider contained in the Data and/or the associated metadata or databases, unless otherwise individually agreed between the Parties in the usage purposes for a specific Use Case (cx-policy:UsagePurpose) or in the referenced bilateral contract (cx-policy:ContractReference).',
      },
      value: 'cx.dataProviderRemoval.forbidden:1',
    };
  }
}

export class AtomicConstraints {
  static DataProvisioningEndDurationDaysConstraint(): AtomicConstraint {
    return new AtomicConstraint(
      'DataProvisioningEndDurationDays',
      ['eq'],
      RightOperands.DataProvisioningEndDurationDays(),
    );
  }

  static DataProvisioningEndDateConstraint(): AtomicConstraint {
    return new AtomicConstraint('DataProvisioningEndDate', ['eq'], RightOperands.DataProvisioningEndDate());
  }

  static FrameworkAgreementConstraint(): AtomicConstraint {
    return new AtomicConstraint('FrameworkAgreement', ['eq'], RightOperands.DataExchangeGovernance());
  }

  static MembershipConstraint(): AtomicConstraint {
    return new AtomicConstraint('Membership', ['eq'], RightOperands.MembershipActive());
  }

  static BusinessPartnerNumberConstraint(): AtomicConstraint {
    return new AtomicConstraint(
      'BusinessPartnerNumber',
      ['isAnyOf', 'isNoneOf'],
      [RightOperands.BusinessPartnerNumber()],
    );
  }

  static BusinessPartnerGroupConstraint(): AtomicConstraint {
    return new AtomicConstraint(
      'BusinessPartnerGroup',
      ['isAnyOf', 'isNoneOf'],
      [RightOperands.BusinessPartnerGroup()],
    );
  }

  static UsagePurposeConstraint(): AtomicConstraint {
    return new AtomicConstraint(
      'UsagePurpose',
      ['isAnyOf'],
      [
        RightOperands.CoreLegalRequirementForThirdParty(),
        RightOperands.CoreIndustrycore(),
        RightOperands.CoreQualityNotifications(),
        RightOperands.CoreDigitalTwinRegistry(),
        RightOperands.PfcBase(),
        RightOperands.QualityBase(),
        RightOperands.DcmBase(),
        RightOperands.PurisBase(),
        RightOperands.CircularDpp(),
        RightOperands.CircularSmc(),
        RightOperands.CircularMarketplace(),
        RightOperands.CircularMaterialaccounting(),
        RightOperands.BpdmGateUpload(),
        RightOperands.BpdmGateDownload(),
        RightOperands.BpdmPool(),
        RightOperands.BpdmVasCountryrisk(),
        RightOperands.BpdmVasDataqualityUpload(),
        RightOperands.BpdmVasDataqualityDownload(),
        RightOperands.BpdmVasBdvUpload(),
        RightOperands.BpdmVasFpdUpload(),
        RightOperands.BpdmVasFpdDownload(),
        RightOperands.BpdmVasSwdUpload(),
        RightOperands.BpdmVasSwdDownload(),
        RightOperands.BpdmVasNpsUpload(),
        RightOperands.BpdmVasNpsDownload(),
        RightOperands.CcmBase(),
        RightOperands.BpdmPoolAll(),
        RightOperands.LogisticsBase(),
        RightOperands.UsagePurposeIndividual(),
      ],
    );
  }

  static ContractReferenceConstraint(): AtomicConstraint {
    return new AtomicConstraint('ContractReference', ['isAllOf'], [RightOperands.ContractReference()]);
  }

  static AffiliatesRegionConstraint(): AtomicConstraint {
    return new AtomicConstraint(
      'AffiliatesRegion',
      ['isAnyOf'],
      [
        RightOperands.RegionAll(),
        RightOperands.RegionEurope(),
        RightOperands.RegionNorthAmerica(),
        RightOperands.RegionSouthAmerica(),
        RightOperands.RegionAfrica(),
        RightOperands.RegionAsia(),
        RightOperands.RegionOceania(),
        RightOperands.RegionAntarctica(),
      ],
    );
  }

  static AffiliatesBpnlConstraint1(): AtomicConstraint {
    return new AtomicConstraint('AffiliatesBpnl', ['isAnyOf'], [RightOperands.AffiliatesBpnl()]);
  }

  static DataFrequencyConstraint(): AtomicConstraint {
    return new AtomicConstraint(
      'DataFrequency',
      ['eq'],
      [RightOperands.DataFrequencyOnce(), RightOperands.DataFrequencyUnlimited()],
    );
  }

  static VersionChangesConstraint(): AtomicConstraint {
    return new AtomicConstraint(
      'VersionChanges',
      ['eq'],
      [RightOperands.VersionChangesMinor(), RightOperands.VersionChangesMajor()],
    );
  }

  static ContractTerminationConstraint(): AtomicConstraint {
    return new AtomicConstraint(
      'ContractTermination',
      ['eq'],
      [RightOperands.DataDeletion(), RightOperands.DataKeeping()],
    );
  }

  static ConfidentialInformationMeasuresConstraint(): AtomicConstraint {
    return new AtomicConstraint('ConfidentialInformationMeasures', ['eq'], RightOperands.ConfidentialityMeasures());
  }

  static ConfidentialInformationSharingConstraint(): AtomicConstraint {
    return new AtomicConstraint(
      'ConfidentialInformationSharing',
      ['isAnyOf'],
      [RightOperands.SharingAffiliates(), RightOperands.SharingManagedLegalEntity()],
    );
  }

  static ExclusiveUsageConstraint(): AtomicConstraint {
    return new AtomicConstraint('ExclusiveUsage', ['eq'], RightOperands.ExclusiveUsageDataConsumer());
  }

  static WarrantyConstraint(): AtomicConstraint {
    return new AtomicConstraint(
      'Warranty',
      ['eq'],
      [
        RightOperands.WarrantyNone(),
        RightOperands.WarrantyContractReference(),
        RightOperands.WarrantyDataQualityIssues(),
      ],
    );
  }

  static WarrantyDurationConstraint(): AtomicConstraint {
    return new AtomicConstraint('WarrantyDurationMonths', ['eq'], RightOperands.WarrantyDurationMonths());
  }

  static WarrantyConstraint1(): AtomicConstraint {
    return new AtomicConstraint('WarrantyDefinition', ['eq'], RightOperands.WarrantyContractEndDate());
  }

  static LiabilityConstraint(): AtomicConstraint {
    return new AtomicConstraint(
      'Liability',
      ['eq'],
      [RightOperands.GrossNegligence(), RightOperands.SlightNegligence()],
    );
  }

  static JurisdictionLocationConstraint(): AtomicConstraint {
    return new AtomicConstraint('JurisdictionLocation', ['eq'], RightOperands.LocationString());
  }

  static JurisdictionLocationReferenceConstraint(): AtomicConstraint {
    return new AtomicConstraint(
      'JurisdictionLocationReference',
      ['eq'],
      [RightOperands.LocationDataConsumer(), RightOperands.LocationContractReference()],
    );
  }

  static PrecedenceConstraint(): AtomicConstraint {
    return new AtomicConstraint(
      'Precedence',
      ['eq'],
      [RightOperands.PrecedenceContractReference(), RightOperands.PrecedenceRcAgreement()],
    );
  }

  static DataUsageEndDurationDaysConstraint(): AtomicConstraint {
    return new AtomicConstraint('DataUsageEndDurationDays', ['eq'], RightOperands.DataUsageEndDurationDays());
  }

  static DataUsageEndDateConstraint(): AtomicConstraint {
    return new AtomicConstraint('DataUsageEndDate', ['eq'], RightOperands.DataUsageEndDate());
  }

  static DataUsageEndDefinitionConstraint(): AtomicConstraint {
    return new AtomicConstraint('DataUsageEndDefinition', ['eq'], RightOperands.DataUsageEndDefinition());
  }

  static UsageRestrictionConstraint(): AtomicConstraint {
    return new AtomicConstraint(
      'UsageRestriction',
      ['isAllOf'],
      [
        RightOperands.ThirdPartyForbidden(),
        RightOperands.ManipulationForbidden(),
        RightOperands.DerivationsForbidden(),
        RightOperands.ExtraordinaryAnalyticsForbidden(),
        RightOperands.DataProviderRemovalForbidden(),
      ],
    );
  }
}

export class RuleSets {
  static AccessPermissions(): AtomicConstraint[] {
    return [
      AtomicConstraints.FrameworkAgreementConstraint(),
      AtomicConstraints.MembershipConstraint(),
      AtomicConstraints.BusinessPartnerNumberConstraint(),
      AtomicConstraints.BusinessPartnerGroupConstraint(),
    ];
  }

  static UsagePermissions(): AtomicConstraint[] {
    return [
      AtomicConstraints.MembershipConstraint(),
      AtomicConstraints.ContractReferenceConstraint(),
      AtomicConstraints.AffiliatesRegionConstraint(),
      AtomicConstraints.AffiliatesBpnlConstraint1(),
      AtomicConstraints.DataFrequencyConstraint(),
      AtomicConstraints.VersionChangesConstraint(),
      AtomicConstraints.ContractTerminationConstraint(),
      AtomicConstraints.ConfidentialInformationMeasuresConstraint(),
      AtomicConstraints.ConfidentialInformationSharingConstraint(),
      AtomicConstraints.ExclusiveUsageConstraint(),
      AtomicConstraints.WarrantyConstraint(),
      AtomicConstraints.WarrantyDurationConstraint(),
      AtomicConstraints.WarrantyConstraint1(),
      AtomicConstraints.LiabilityConstraint(),
      AtomicConstraints.JurisdictionLocationConstraint(),
      AtomicConstraints.JurisdictionLocationReferenceConstraint(),
      AtomicConstraints.PrecedenceConstraint(),
      AtomicConstraints.DataUsageEndDurationDaysConstraint(),
      AtomicConstraints.DataUsageEndDateConstraint(),
      AtomicConstraints.DataUsageEndDefinitionConstraint(),
    ];
  }

  static UsageObligations(): AtomicConstraint[] {
    return [
      AtomicConstraints.DataProvisioningEndDurationDaysConstraint(),
      AtomicConstraints.DataProvisioningEndDateConstraint(),
    ];
  }

  static UsageProhibitions(): AtomicConstraint[] {
    return [
      AtomicConstraints.AffiliatesRegionConstraint(),
      AtomicConstraints.AffiliatesBpnlConstraint1(),
      AtomicConstraints.UsageRestrictionConstraint(),
    ];
  }
}

export class PolicyTemplates {
  static AccessTemplates(): PolicyConfiguration[] {
    return RuleSets.AccessPermissions().map((constraint: Constraint) => {
      const atomic = constraint as AtomicConstraint;
      const name = `Permission - ${camelCaseToWords(atomic.leftOperand)}`;
      const template = new PolicyConfiguration(name);
      const permission = new Permission();
      permission.name = camelCaseToWords(atomic.leftOperand);
      permission.action = Action.Access;
      permission.constraints.push(constraint);
      template.policy.permissions.push(permission);
      template.policy.type = Action.Access;
      return template;
    });
  }

  static UsageTemplates(): PolicyConfiguration[] {
    const permissions = RuleSets.UsagePermissions().map((constraint: Constraint) => {
      const atomic = constraint as AtomicConstraint;
      const name = `Permission - ${camelCaseToWords(atomic.leftOperand)}`;
      const template = new PolicyConfiguration(name);
      const permission = new Permission();
      permission.name = camelCaseToWords(atomic.leftOperand);
      permission.constraints.push(constraint);
      template.policy.permissions.push(permission);
      return template;
    });
    const obligations = RuleSets.UsageObligations().map((constraint: Constraint) => {
      const atomic = constraint as AtomicConstraint;
      const name = `Obligation - ${camelCaseToWords(atomic.leftOperand)}`;
      const template = new PolicyConfiguration(name);
      const permission = new Permission();
      permission.name = camelCaseToWords(atomic.leftOperand);
      permission.constraints.push(constraint);
      template.policy.obligations.push(permission);
      return template;
    });
    const prohibitions = RuleSets.UsageProhibitions().map((constraint: Constraint) => {
      const atomic = constraint as AtomicConstraint;
      const name = `Prohibition - ${camelCaseToWords(atomic.leftOperand)}`;
      const template = new PolicyConfiguration(name);
      const permission = new Permission();
      permission.name = camelCaseToWords(atomic.leftOperand);
      permission.constraints.push(constraint);
      template.policy.prohibitions.push(permission);
      return template;
    });
    const templates = [...permissions, ...obligations, ...prohibitions];
    this._addAgreementAndPurpose(templates);
    return templates;
  }

  private static _addAgreementAndPurpose(configs: PolicyConfiguration[]): void {
    const permission = new Permission();
    permission.name = 'Usage Base';
    permission.constraints.push(
      AtomicConstraints.UsagePurposeConstraint(),
      AtomicConstraints.FrameworkAgreementConstraint(),
    );
    configs.forEach(config => config.policy.permissions.push(permission));
  }
}
