// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ABFI Evidence Anchor Contract
 * @notice Stores Merkle roots of evidence batches for immutable audit trails
 * @dev Deployed on Ethereum Mainnet/Sepolia for evidence integrity verification
 */
contract EvidenceAnchor {
    // ============================================================================
    // State Variables
    // ============================================================================

    struct Anchor {
        bytes32 merkleRoot;
        uint256 leafCount;
        uint256 timestamp;
        address submitter;
        uint256 batchId;
    }

    uint256 public nextAnchorId;
    mapping(uint256 => Anchor) public anchors;
    mapping(bytes32 => uint256) public merkleRootToAnchorId;

    address public admin;
    mapping(address => bool) public authorizedSubmitters;

    // ============================================================================
    // Events
    // ============================================================================

    event MerkleRootAnchored(
        uint256 indexed anchorId,
        bytes32 indexed merkleRoot,
        uint256 leafCount,
        address submitter
    );

    event SubmitterAuthorized(address indexed submitter, bool authorized);
    event AdminTransferred(address indexed previousAdmin, address indexed newAdmin);

    // ============================================================================
    // Modifiers
    // ============================================================================

    modifier onlyAdmin() {
        require(msg.sender == admin, "EvidenceAnchor: caller is not admin");
        _;
    }

    modifier onlyAuthorized() {
        require(
            authorizedSubmitters[msg.sender] || msg.sender == admin,
            "EvidenceAnchor: caller is not authorized"
        );
        _;
    }

    // ============================================================================
    // Constructor
    // ============================================================================

    constructor() {
        admin = msg.sender;
        authorizedSubmitters[msg.sender] = true;
        nextAnchorId = 1;
    }

    // ============================================================================
    // Admin Functions
    // ============================================================================

    /**
     * @notice Transfer admin role to a new address
     * @param newAdmin The new admin address
     */
    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "EvidenceAnchor: new admin is zero address");
        emit AdminTransferred(admin, newAdmin);
        admin = newAdmin;
    }

    /**
     * @notice Authorize or revoke a submitter
     * @param submitter The address to authorize/revoke
     * @param authorized Whether to authorize or revoke
     */
    function setSubmitterAuthorization(address submitter, bool authorized) external onlyAdmin {
        authorizedSubmitters[submitter] = authorized;
        emit SubmitterAuthorized(submitter, authorized);
    }

    // ============================================================================
    // Core Functions
    // ============================================================================

    /**
     * @notice Anchor a Merkle root to the blockchain
     * @param merkleRoot The Merkle root of the evidence batch
     * @param leafCount The number of leaves (evidence items) in the batch
     * @param batchId The off-chain batch identifier
     * @return anchorId The on-chain anchor identifier
     */
    function anchorMerkleRoot(
        bytes32 merkleRoot,
        uint256 leafCount,
        uint256 batchId
    ) external onlyAuthorized returns (uint256 anchorId) {
        require(merkleRoot != bytes32(0), "EvidenceAnchor: invalid merkle root");
        require(leafCount > 0, "EvidenceAnchor: leaf count must be positive");
        require(merkleRootToAnchorId[merkleRoot] == 0, "EvidenceAnchor: merkle root already anchored");

        anchorId = nextAnchorId++;

        anchors[anchorId] = Anchor({
            merkleRoot: merkleRoot,
            leafCount: leafCount,
            timestamp: block.timestamp,
            submitter: msg.sender,
            batchId: batchId
        });

        merkleRootToAnchorId[merkleRoot] = anchorId;

        emit MerkleRootAnchored(anchorId, merkleRoot, leafCount, msg.sender);

        return anchorId;
    }

    /**
     * @notice Get anchor data by ID
     * @param anchorId The anchor identifier
     * @return merkleRoot The Merkle root
     * @return leafCount The number of leaves
     * @return timestamp The anchoring timestamp
     * @return submitter The submitter address
     */
    function getAnchor(uint256 anchorId)
        external
        view
        returns (
            bytes32 merkleRoot,
            uint256 leafCount,
            uint256 timestamp,
            address submitter
        )
    {
        Anchor storage anchor = anchors[anchorId];
        require(anchor.timestamp != 0, "EvidenceAnchor: anchor does not exist");

        return (
            anchor.merkleRoot,
            anchor.leafCount,
            anchor.timestamp,
            anchor.submitter
        );
    }

    /**
     * @notice Verify a Merkle proof
     * @param merkleRoot The expected Merkle root
     * @param leaf The leaf hash to verify
     * @param proof The Merkle proof (sibling hashes)
     * @return valid Whether the proof is valid
     */
    function verifyInclusion(
        bytes32 merkleRoot,
        bytes32 leaf,
        bytes32[] calldata proof
    ) external pure returns (bool valid) {
        bytes32 computedHash = leaf;

        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];

            if (computedHash <= proofElement) {
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }
        }

        return computedHash == merkleRoot;
    }

    /**
     * @notice Get anchor ID by Merkle root
     * @param merkleRoot The Merkle root to look up
     * @return anchorId The anchor identifier (0 if not found)
     */
    function getAnchorIdByMerkleRoot(bytes32 merkleRoot) external view returns (uint256) {
        return merkleRootToAnchorId[merkleRoot];
    }

    /**
     * @notice Check if a Merkle root has been anchored
     * @param merkleRoot The Merkle root to check
     * @return anchored Whether the root is anchored
     */
    function isAnchored(bytes32 merkleRoot) external view returns (bool) {
        return merkleRootToAnchorId[merkleRoot] != 0;
    }
}
