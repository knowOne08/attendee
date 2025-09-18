import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import BaseScreen from '../components/BaseScreen';
import SearchBar from '../components/SearchBar';
import MemberFormModal from '../components/MemberFormModal';
import { colors, spacing, typography } from '../utils/theme';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { userAPI } from '../services/api';

const MembersScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchMembers = async () => {
    try {
      console.log('🔍 Fetching members...');
      const response = await userAPI.getUsers();
      console.log('📋 Members response structure:', typeof response, Array.isArray(response));
      
      // Handle different response structures  
      let membersData;
      if (Array.isArray(response)) {
        // Direct array response
        membersData = response;
      } else if (response.data) {
        if (Array.isArray(response.data)) {
          // Axios wrapped array response
          membersData = response.data;
        } else if (response.data.users) {
          // Backend structured response with users property
          membersData = response.data.users;
        } else {
          membersData = [];
        }
      } else {
        membersData = [];
      }
      
      console.log('👥 Members loaded:', membersData.length);
      setMembers(membersData);
      setFilteredMembers(membersData);
    } catch (err) {
      console.error('Error fetching members:', err);
      showError('Failed to load members');
      // Use mock data as fallback
      const mockMembers = [
        {
          _id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'member',
          status: 'active',
          rfidTag: 'RF001',
        },
        {
          _id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'mentor',
          status: 'active',
          rfidTag: 'RF002',
        },
        {
          _id: '3',
          name: 'Bob Wilson',
          email: 'bob@example.com',
          role: 'admin',
          status: 'active',
          rfidTag: 'RF003',
        },
      ];
      setMembers(mockMembers);
      setFilteredMembers(mockMembers);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMembers();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = members.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMembers(filtered);
    } else {
      setFilteredMembers(members);
    }
  }, [searchTerm, members]);

  const handleAddMember = () => {
    setEditingMember(null);
    setModalVisible(true);
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setModalVisible(true);
  };

  const handleDeleteMember = (member) => {
    Alert.alert(
      'Delete Member',
      `Are you sure you want to delete ${member.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteMember(member._id)
        }
      ]
    );
  };

  const deleteMember = async (memberId) => {
    try {
      await userAPI.deleteUser(memberId);
      success('Member deleted successfully');
      await fetchMembers();
    } catch (err) {
      console.error('Error deleting member:', err);
      showError(err.response?.data?.error || 'Failed to delete member');
    }
  };

  const handleModalSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingMember) {
        // Update existing member
        await userAPI.updateUser(editingMember._id, formData);
        success('Member updated successfully');
      } else {
        // Create new member
        await userAPI.createUser(formData);
        success('Member created successfully');
      }
      
      setModalVisible(false);
      setEditingMember(null);
      await fetchMembers();
    } catch (err) {
      console.error('Error saving member:', err);
      showError(err.response?.data?.error || 'Failed to save member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewMember = (member) => {
    navigation.navigate('UserDetail', { id: member._id });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return colors.error;
      case 'mentor':
        return colors.warning;
      default:
        return colors.success;
    }
  };

  if (loading) {
    return (
      <BaseScreen title="Members" navigation={navigation}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </BaseScreen>
    );
  }

  return (
    <BaseScreen title="Members" navigation={navigation}>
      <View style={styles.container}>
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm}
          placeholder="Search members..."
        />

        {user?.role === 'admin' && (
          <TouchableOpacity style={styles.addButton} onPress={handleAddMember}>
            <Text style={styles.addButtonText}>Add Member</Text>
          </TouchableOpacity>
        )}

        <ScrollView 
          style={styles.membersList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredMembers.length === 0 ? (
            <Text style={styles.noMembers}>
              {searchTerm ? 'No members found matching your search' : 'No members found'}
            </Text>
          ) : (
            filteredMembers.map((member) => (
              <TouchableOpacity 
                key={member._id} 
                style={styles.memberCard}
                onPress={() => handleViewMember(member)}
              >
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberEmail}>{member.email}</Text>
                  <View style={styles.memberMeta}>
                    <Text style={[styles.memberRole, { color: getRoleColor(member.role) }]}>
                      {member.role.toUpperCase()}
                    </Text>
                    <Text style={[
                      styles.memberStatus,
                      { color: member.status === 'active' ? colors.success : colors.text.secondary }
                    ]}>
                      {member.status?.toUpperCase() || 'ACTIVE'}
                    </Text>
                  </View>
                </View>

                {user?.role === 'admin' && (
                  <View style={styles.memberActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleEditMember(member);
                      }}
                    >
                      <Text style={styles.actionButtonText}>Edit</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleDeleteMember(member);
                      }}
                    >
                      <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        <MemberFormModal
          isVisible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setEditingMember(null);
          }}
          onSubmit={handleModalSubmit}
          member={editingMember}
          loading={submitting}
        />
      </View>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  addButtonText: {
    color: colors.white,
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
    letterSpacing: 2,
  },
  membersList: {
    flex: 1,
  },
  memberCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  memberEmail: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  memberMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberRole: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
    letterSpacing: 1,
    marginRight: spacing.md,
  },
  memberStatus: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
    letterSpacing: 1,
  },
  memberActions: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginLeft: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  actionButtonText: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
    color: colors.primary,
    letterSpacing: 1,
  },
  deleteButton: {
    borderColor: colors.error,
  },
  deleteButtonText: {
    color: colors.error,
  },
  noMembers: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingVertical: spacing.xl,
    fontStyle: 'italic',
  },
});

export default MembersScreen;
