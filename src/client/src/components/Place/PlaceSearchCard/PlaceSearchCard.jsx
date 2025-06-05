import styles from './PlaceSearchCard.module.css';

import {
    Spin,
    ConfigProvider,
    Empty,
    Input,
    Select,
    Cascader,
} from "antd";

import {
    SearchOutlined,
    AppstoreOutlined,
    GlobalOutlined,
    TagsOutlined,
} from '@ant-design/icons';

import { motion } from "framer-motion";

import { PlaceSearchContext } from '../../../constants/placeSearchContext';

const PlaceSearchCard = ({
    state,
    dispatch,
    categoryOptions,
    countryOptions,
    setCountryOptions,
    tags,
    isForAdmin,
    userFollowingUserName
}) => {
    return (

        <div className={isForAdmin ? styles.adminSearchPanel : styles.searchPanel}>

            <div style={{ display: 'flex', justifyContent: 'center' }}>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{
                            scale: 1.05,
                            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
                        }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        style={{
                            background: isForAdmin ? 'linear-gradient(135deg, #91d5ff, #bae7ff)' : 'linear-gradient(135deg, #b7eb8f, #87e8de)',
                            color: '#004d40',
                            borderRadius: '16px',
                            padding: '0.75rem 2rem',
                            display: 'inline-block',
                            fontWeight: '600',
                            fontSize: '1.4rem',
                            letterSpacing: '0.5px',
                            border: '1px solid rgba(0, 0, 0, 0.05)',
                            fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                        }}
                    >
                        <SearchOutlined style={{ marginRight: 10 }} />
                        {state.searchContext === PlaceSearchContext.Global && 'Search Places'}
                        {state.searchContext === PlaceSearchContext.UserPlaces && `Search in ${state.filter} Places`}
                        {state.searchContext === PlaceSearchContext.Admin && `Search in ${state.filter} Places`}
                        {state.searchContext === PlaceSearchContext.UserFollowing && `Search in ${userFollowingUserName}'s places`}
                        {state.searchContext === PlaceSearchContext.FavPlace && `Search in Favorite Places`}
                    </motion.div>
                </div>
            </div>

            <Input
                allowClear
                size="large"
                placeholder="Start typing place name..."
                prefix={<SearchOutlined
                    style={{
                        color: isForAdmin ? '#1677ff' : '#52c41a',
                        fontSize: 20,
                        marginRight: 10
                    }}
                />}
                value={state.placeName}
                onChange={(e) => dispatch({ type: 'SET_PLACE_NAME', payload: e.target.value })}
                name="PlaceName"
                style={{
                    height: '4rem',
                    fontSize: '1.4rem',
                    paddingLeft: '12px',
                    fontFamily: 'Poppins, Segoe UI, sans-serif',
                }}
            />

            <Cascader
                prefix={<AppstoreOutlined
                    style={{
                        color: isForAdmin ? '#1677ff' : '#52c41a',
                        fontSize: 20,
                        marginRight: 10
                    }} />}
                options={categoryOptions}
                value={state.selectedCategoryPath}
                onChange={(value) => dispatch({ type: 'SET_CATEGORY', payload: value })}
                placeholder="Select category/subcategory"
                allowClear
                style={{
                    width: '100%',
                    marginTop: '1rem',
                    height: '4rem',
                    fontFamily: 'Poppins, Segoe UI, sans-serif',
                }}
                styles={{
                    popup: {
                        fontSize: '1.4rem',
                    }
                }}
                className={styles.cascaderInput}
                classNames={{ popup: { root: 'dropdownPopup' } }}
                changeOnSelect
                expandTrigger="hover"
                size="large"
            />

            <Select
                className={styles.countriesSelect}
                classNames={{ popup: { root: 'customCountryDropdown' } }}
                prefix={<GlobalOutlined style={{ color: isForAdmin ? '#1677ff' : '#52c41a', fontSize: 20, marginRight: 10 }} />}
                size='large'
                showSearch
                allowClear
                placeholder="Start typing and select a country..."
                optionFilterProp="label"
                style={{ width: '100%', textAlign: 'left', marginTop: '1rem' }}
                value={state.selectedCountryId}
                onSearch={(value) => {
                    dispatch({ type: 'SET_COUNTRY_SEARCH', payload: value });
                    dispatch({ type: 'SET_OPEN_COUNTRY_DROPDOWN', payload: true });

                    if (value.trim() === '') {
                        dispatch({ type: 'SET_COUNTRY_LOADING', payload: false });
                        setCountryOptions([]);
                    } else {
                        dispatch({ type: 'SET_COUNTRY_LOADING', payload: true });
                    }

                }}
                onChange={(value) => dispatch({ type: 'SET_COUNTRY', payload: value })}
                onBlur={() => {
                    setCountryOptions([]);
                    dispatch({ type: 'SET_OPEN_COUNTRY_DROPDOWN', payload: false });
                }}
                open={state.openCountryDropdown}
                onOpenChange={(open) => {
                    if (!state.countryLoading) {
                        dispatch({ type: 'SET_OPEN_COUNTRY_DROPDOWN', payload: open });
                    }
                }}
                notFoundContent={
                    state.countryLoading ? (
                        <div style={{ padding: '2rem 0', textAlign: 'center' }}>
                            <ConfigProvider
                                theme={{
                                    components: {
                                        Spin: { colorPrimary: 'green' }
                                    }
                                }}
                            >
                                <div style={{ padding: '3rem 0', textAlign: 'center' }}>
                                    <Spin style={{ transform: 'scale(1.5)' }} size="large" />
                                </div>
                            </ConfigProvider>
                        </div>
                    ) : <Empty style={{ transform: 'scale(1.2)', margin: '2rem 0' }} />
                }
                options={countryOptions}
            />

            <Select
                className={styles.tagsSelect}
                classNames={{ popup: { root: 'tagsSelectDropdown' } }}
                prefix={<TagsOutlined style={{ color: isForAdmin ? '#1677ff' : '#52c41a', marginRight: 10 }} />}
                mode="multiple"
                style={{ width: '100%', marginTop: '2rem', textAlign: 'left' }}
                placeholder="Select Tags"
                onChange={(value) => {
                    if (value.length <= 20) {
                        dispatch({ type: 'SET_TAGS', payload: value });
                    }
                }}
                options={tags}
                size='large'
                allowClear
                showSearch
                optionFilterProp="label"
                value={state.selectedTagIds}
            />

        </div>

    );
};

export default PlaceSearchCard;

