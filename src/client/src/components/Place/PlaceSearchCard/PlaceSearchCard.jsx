import {
    Spin,
    ConfigProvider,
    Card,
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

const PlaceSearchCard = ({
    state,
    dispatch,
    categoryOptions,
    countryOptions,
    setCountryOptions,
    tags,
    isForAdmin
}) => {
    return (
        <Card
            title={
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '1.3rem',
                    fontWeight: 600,
                    color: '#fff',
                }}>
                    <SearchOutlined style={{ fontSize: '1.5rem' }} />

                    {state.searchContext === 'global' ? 'Search Places' : (state.filter ? `Search in ${state.filter} Places` : 'Search Places')}
                </div>
            }
            style={{
                marginTop: '1.5rem',
                width: state.searchContext === 'global' ? '50%' : '100%',
                border: 'none'
            }}
            styles={{
                header: {
                    textAlign: 'left',
                    background: isForAdmin
                        ? 'linear-gradient(90deg, #1677ff 0%, #69c0ff 100%)' // bluish gradient
                        : 'linear-gradient(90deg, #52c41a 0%, #36cfc9 100%)', // greenish gradient
                }
            }}
        >

            <Input
                allowClear
                size="large"
                placeholder="Start typing place name..."
                prefix={<SearchOutlined style={{ color: isForAdmin ? '#1677ff' : '#52c41a' }} />}
                value={state.placeName}
                onChange={(e) => dispatch({ type: 'SET_PLACE_NAME', payload: e.target.value })}
            />

            <Cascader
                prefix={<AppstoreOutlined style={{ color: isForAdmin ? '#1677ff' : '#52c41a' }} />}
                options={categoryOptions}
                value={state.selectedCategoryPath}
                onChange={(value) => dispatch({ type: 'SET_CATEGORY', payload: value })}
                placeholder="Select category/subcategory"
                allowClear
                style={{ width: '100%', textAlign: 'left', marginTop: '1rem' }}
                changeOnSelect
                expandTrigger="hover"
            />

            <Select
                prefix={<GlobalOutlined style={{ color: isForAdmin ? '#1677ff' : '#52c41a' }} />}
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
                                <Spin size="large" />
                            </ConfigProvider>
                        </div>
                    ) : <Empty />
                }
                options={countryOptions}
            />

            <ConfigProvider
                theme={{
                    components: {
                        Select: {
                            optionActiveBg: '#ecfffb',
                            optionSelectedBg: '#d6f5e3',
                            optionSelectedColor: '#1a3d2f',
                        }
                    }
                }}
            >
                <Select
                    prefix={<TagsOutlined style={{ color: isForAdmin ? '#1677ff' : '#52c41a' }} />}
                    mode="multiple"
                    style={{ width: '100%', marginTop: '1rem', textAlign: 'left' }}
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

            </ConfigProvider>

        </Card>
    );
};

export default PlaceSearchCard;

